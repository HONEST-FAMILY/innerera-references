import sys
import wave

import numpy as np

SR = 48000
DUR = 27.5
N = int(SR * DUR)
T = np.arange(N) / SR
rng = np.random.default_rng(11)

BAR0 = 0.05
BAR = 2.5
BEAT = BAR / 4


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


CHORDS = [
    [50, 57, 61, 64, 66],
    [47, 54, 57, 61, 62],
    [43, 50, 54, 57, 59],
    [45, 52, 54, 57, 61],
    [50, 57, 61, 64, 66],
    [47, 54, 57, 61, 62],
    [43, 50, 54, 57, 59],
    [45, 52, 54, 57, 61],
    [40, 50, 54, 55, 59],
    [50, 57, 61, 64, 69],
    [50, 57, 61, 66, 69],
]
ROOTS = [38, 35, 31, 33, 38, 35, 31, 33, 28, 38, 38]


def env_seg(t0, t1, att, rel):
    e = np.zeros(N)
    a = np.clip((T - t0) / att, 0, 1)
    r = np.clip(1 - (T - t1) / rel, 0, 1)
    e = np.minimum(a, r)
    e[T < t0] = 0
    return e * e * (3 - 2 * e)


def place(buf, sig, t0, gain=1.0, pan=0.0):
    i0 = int(round(t0 * SR))
    if i0 >= N:
        return
    n = min(len(sig), N - i0)
    if i0 < 0:
        sig = sig[-i0:]
        n = min(len(sig), N)
        i0 = 0
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    buf[0, i0:i0 + n] += sig[:n] * gain * l * 1.414
    buf[1, i0:i0 + n] += sig[:n] * gain * r * 1.414


def fft_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        g *= 1 / np.sqrt(1 + (f / hi) ** 4)
    return np.fft.irfft(X * g, len(x))


def reverb_ir(seconds=2.6, seed=3):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    decay = np.exp(-t * 3.0)
    ir = np.zeros((2, n))
    for c in range(2):
        noise = r.normal(0, 1, n)
        noise = fft_filter(noise, lo=180, hi=7000)
        ir[c] = noise * decay
    ir[:, : int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
    return ir


def convolve(x, ir):
    n = len(x) + len(ir) - 1
    m = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(ir, m), m)[: len(x)]
    return y


def pad():
    out = np.zeros((2, N))
    for b, chord in enumerate(CHORDS):
        t0 = BAR0 + b * BAR - (0.35 if b else 0.05)
        t1 = BAR0 + (b + 1) * BAR - 0.1
        if b == len(CHORDS) - 1:
            t1 = DUR - 0.2
        att = 1.6 if b == 0 else 0.55
        e = env_seg(max(t0, 0), t1, att, 1.1)
        bright = min(1.0, 0.35 + 0.22 * b) if b < 3 else (0.9 if b < 8 else 1.0)
        nh = int(3 + 9 * bright)
        for k, m in enumerate(chord):
            f = midi(m + (12 if k > 0 else 0))
            for side, det in ((0, -5), (1, 6)):
                ff = f * 2 ** (det / 1200)
                ph = rng.uniform(0, 2 * np.pi)
                v = np.zeros(N)
                idx = e > 0
                tt = T[idx]
                acc = np.zeros(idx.sum())
                for h in range(1, nh + 1):
                    if ff * h > 7000:
                        break
                    acc += np.sin(2 * np.pi * ff * h * tt + ph * h) / h ** 1.6
                lfo = 1 + 0.08 * np.sin(2 * np.pi * (0.18 + 0.03 * k) * tt + k)
                v[idx] = acc * lfo
                out[side] += v * e * (0.9 if k == 0 else 0.6)
    return out * 0.05


def bass():
    out = np.zeros(N)
    for b, r in enumerate(ROOTS):
        if b < 1:
            continue
        t0 = BAR0 + b * BAR
        t1 = t0 + BAR - 0.08 if b < len(ROOTS) - 1 else DUR - 0.3
        e = env_seg(t0, t1, 0.08, 0.5)
        f = midi(r + 12)
        out += (np.sin(2 * np.pi * f * T) + 0.35 * np.sin(4 * np.pi * f * T) + 0.18 * np.sin(6 * np.pi * f * T) + 0.08 * np.sin(8 * np.pi * f * T)) * e
    return out * 0.04


def bell(f, dur=2.2, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.6)
    y += 0.42 * bright * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t * 4.5)
    y += 0.22 * bright * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 7)
    y += 0.12 * bright * np.sin(2 * np.pi * f * 5.43 * t) * np.exp(-t * 12)
    y *= np.minimum(1, t / 0.003)
    return y


def pluck(f, dur=0.9):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t + 0.8 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 18)) * np.exp(-t * 5.5)
    y += 0.18 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 16)
    y *= np.minimum(1, t / 0.002)
    return y


def kick():
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    f = 46 + 70 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * np.minimum(1, t / 0.002)


def shaker():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    x = rng.normal(0, 1, n)
    x = np.diff(np.concatenate([[0], x]))
    return x * np.minimum(1, t / 0.008) * np.exp(-t * 55)


BANDS = [(150, 400), (400, 900), (900, 2000), (2000, 4500), (4500, 9000), (9000, 16000)]


def noise_sweep(dur, c0, c1, shape="rise"):
    n = int(dur * SR)
    t = np.arange(n) / SR
    p = t / dur
    x = rng.normal(0, 1, n)
    pos = c0 + (c1 - c0) * p
    y = np.zeros(n)
    for i, (lo, hi) in enumerate(BANDS):
        b = fft_filter(x, lo=lo, hi=hi)
        y += b * np.exp(-0.5 * ((pos - i) / 0.9) ** 2)
    if shape == "rise":
        e = p ** 2.2 * np.minimum(1, (1 - p) / 0.06)
    elif shape == "fall":
        e = (1 - p) ** 2 * np.minimum(1, p / 0.05)
    else:
        e = np.sin(np.pi * p) ** 1.5
    return y * e


def blip(f0, f1, dur=0.16):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 38)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 26) * np.minimum(1, t / 0.0015)


def eq(x):
    X = np.fft.rfft(x)
    f = np.maximum(np.fft.rfftfreq(len(x), 1 / SR), 1)
    lowcut = 1 / np.sqrt(1 + (40 / f) ** 4)
    low_shelf = 10 ** (-4.5 / 20) + (1 - 10 ** (-4.5 / 20)) / (1 + (170 / f) ** 2)
    high_shelf = 1 + (10 ** (3.5 / 20) - 1) / (1 + (3200 / f) ** 2)
    return np.fft.irfft(X * lowcut * low_shelf * high_shelf, len(x))


def air():
    out = np.zeros((2, N))
    for b, chord in enumerate(CHORDS):
        if b < 1:
            continue
        t0 = BAR0 + b * BAR - 0.3
        t1 = BAR0 + (b + 1) * BAR - 0.1 if b < len(CHORDS) - 1 else DUR - 0.2
        e = env_seg(t0, t1, 0.8, 1.2)
        for k, m in enumerate(chord[2:]):
            f = midi(m + 24)
            for side in (0, 1):
                trem = 0.6 + 0.4 * np.sin(2 * np.pi * (0.7 + 0.2 * k + 0.1 * side) * T + k)
                out[side] += np.sin(2 * np.pi * f * (1 + 0.0015 * side) * T) * e * trem
    return out * 0.006


def main(out_path):
    dry = np.zeros((2, N))
    wet_send = np.zeros((2, N))

    p = pad()
    dry += p * 0.85
    wet_send += p * 0.5

    a_ = air()
    dry += a_
    wet_send += a_ * 1.5

    bs = bass()
    dry[0] += bs
    dry[1] += bs

    arp_bars = range(2, 10)
    for b in arp_bars:
        chord = CHORDS[b]
        notes = [chord[1] + 12, chord[2] + 12, chord[3] + 12, chord[4] + 12, chord[3] + 12, chord[2] + 12, chord[1] + 12, chord[2] + 12]
        for i, m in enumerate(notes):
            t0 = BAR0 + b * BAR + i * BEAT / 2
            if b == 9 and i >= 4:
                break
            vel = 0.55 + 0.25 * (i % 4 == 0) + rng.uniform(-0.05, 0.05)
            sig = pluck(midi(m))
            pan = -0.45 if i % 2 == 0 else 0.45
            place(dry, sig, t0, 0.085 * vel, pan)
            place(wet_send, sig, t0, 0.08 * vel, pan)

    for b in range(3, 9):
        bar_t = BAR0 + b * BAR
        for q in range(4):
            if q in (0, 2):
                place(dry, kick(), bar_t + q * BEAT, 0.12 if q == 0 else 0.08)
                place(dry, shaker(), bar_t + q * BEAT, 0.02)
        for e8 in range(8):
            if e8 % 2 == 1:
                sh = shaker()
                place(dry, sh, bar_t + e8 * BEAT / 2, 0.035, 0.3)
                place(wet_send, sh, bar_t + e8 * BEAT / 2, 0.02, 0.3)

    sw = noise_sweep(1.9, 0.5, 3.8, "rise")
    place(dry, sw, 0.1, 0.025, -0.2)
    place(wet_send, sw, 0.1, 0.04, -0.2)

    wh = noise_sweep(0.75, 1.0, 4.2, "bell")
    place(dry, wh, 2.35, 0.06, 0.0)
    place(wet_send, wh, 2.35, 0.04, 0.0)

    for k in range(5):
        b = blip(520 + 90 * k, 1300 + 160 * k, 0.2)
        place(dry, b, 6.42 + k * 0.1, 0.07, -0.6 + 0.3 * k)
        place(wet_send, b, 6.42 + k * 0.1, 0.09, -0.6 + 0.3 * k)

    ding_notes = [81, 78, 81, 76, 81]
    for i, bt in enumerate([7.55, 10.05, 12.55, 15.05, 17.55]):
        g = bell(midi(ding_notes[i]), 2.4, 0.8)
        place(dry, g, bt + 0.28, 0.07, 0.25 if i % 2 == 0 else -0.25)
        place(wet_send, g, bt + 0.28, 0.09, 0.25 if i % 2 == 0 else -0.25)
        wh2 = noise_sweep(0.6, 1.5, 4.5, "bell")
        place(dry, wh2, bt - 0.12, 0.022, 0.0)

    ris = noise_sweep(0.9, 1.0, 4.2, "rise")
    place(dry, ris, 19.85, 0.05, 0.0)
    place(wet_send, ris, 19.85, 0.05, 0.0)
    for k in range(5):
        g = bell(midi([86, 85, 83, 81, 78][k]), 1.4, 0.6)
        place(dry, g, 20.8 + k * 0.07 + 0.2, 0.03, -0.4 + 0.2 * k)
        place(wet_send, g, 20.8 + k * 0.07 + 0.2, 0.06, -0.4 + 0.2 * k)

    dn = noise_sweep(0.45, 4.5, 1.0, "fall")
    place(dry, dn, 21.3, 0.05, 0.0)
    thud = blip(160, 58, 0.35)
    place(dry, thud, 22.05, 0.20, 0.1)
    place(wet_send, thud, 22.05, 0.05, 0.1)

    tok = blip(1250, 380, 0.12)
    place(dry, tok, 22.42, 0.16, 0.0)
    place(wet_send, tok, 22.42, 0.10, 0.0)

    shim = noise_sweep(1.2, 4.0, 5.0, "bell")
    place(dry, shim, 24.75, 0.02, 0.0)
    place(wet_send, shim, 24.75, 0.05, 0.0)
    for k, m in enumerate([74, 78, 81, 86]):
        g = bell(midi(m), 3.0, 0.7)
        place(dry, g, 24.95 + k * 0.06, 0.045, -0.3 + 0.2 * k)
        place(wet_send, g, 24.95 + k * 0.06, 0.08, -0.3 + 0.2 * k)

    ir = reverb_ir()
    wet = np.stack([convolve(wet_send[0], ir[0]), convolve(wet_send[1], ir[1])]) * 0.55
    mix = dry + wet

    mix = np.stack([eq(mix[0]), eq(mix[1])])
    mix = np.stack([0.8 * mix[0] + 0.2 * mix[1], 0.8 * mix[1] + 0.2 * mix[0]])
    fade_in = np.minimum(1, T / 0.04)
    fade_out = np.clip((DUR - T) / 1.4, 0, 1) ** 1.5
    mix *= fade_in * fade_out
    peak = np.abs(mix).max()
    mix = mix / peak * 0.92
    mix = np.tanh(mix * 1.15) / np.tanh(1.15)
    mix *= 0.89 / np.abs(mix).max()
    pcm = (mix.T * 32767).astype(np.int16)
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    rms = np.sqrt((mix ** 2).mean())
    print("saved", out_path, f"rms={20*np.log10(rms):.1f}dBFS")


if __name__ == "__main__":
    main(sys.argv[1])
