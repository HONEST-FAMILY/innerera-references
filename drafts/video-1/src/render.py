import argparse
import subprocess
import sys
import time

import imageio_ffmpeg
from PIL import Image
from io import BytesIO
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8918/drafts/video-1/src/index.html?render=1"
HEADLESS = r"C:\Users\hiwgyum\AppData\Local\ms-playwright\chromium_headless_shell-1243\chrome-headless-shell-win64\chrome-headless-shell.exe"


def open_page(p):
    browser = p.chromium.launch(headless=True, executable_path=HEADLESS)
    page = browser.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
    page.goto(URL, wait_until="networkidle")
    page.wait_for_function("window.__ready === true", timeout=60000)
    page.wait_for_timeout(500)
    return browser, page


def stills(times, out_sheet, cols=6, cell_w=300):
    with sync_playwright() as p:
        browser, page = open_page(p)
        frames = []
        for t in times:
            page.evaluate("t => window.renderAt(t)", t)
            buf = page.screenshot(type="jpeg", quality=90)
            frames.append((t, Image.open(BytesIO(buf)).convert("RGB")))
        browser.close()
    cell_h = int(cell_w * 1920 / 1080)
    rows = (len(frames) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell_w, rows * (cell_h + 18)), (255, 255, 255))
    from PIL import ImageDraw
    d = ImageDraw.Draw(sheet)
    for i, (t, im) in enumerate(frames):
        x = (i % cols) * cell_w
        y = (i // cols) * (cell_h + 18)
        sheet.paste(im.resize((cell_w - 4, cell_h), Image.LANCZOS), (x, y + 16))
        d.text((x + 2, y + 2), f"{t:.2f}s", fill=(200, 0, 0))
    sheet.save(out_sheet, quality=88)
    print("sheet", out_sheet, len(frames))


def single(t, out_path):
    with sync_playwright() as p:
        browser, page = open_page(p)
        page.evaluate("t => window.renderAt(t)", t)
        page.screenshot(path=out_path, type="jpeg", quality=92)
        browser.close()
    print("saved", out_path)


def video(out_path, fps, dur):
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    n = int(round(dur * fps))
    cmd = [ff, "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(fps), "-c:v", "mjpeg", "-i", "-",
           "-vf", "scale=in_color_matrix=bt601:in_range=pc:out_color_matrix=bt709:out_range=tv,format=yuv420p",
           "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-profile:v", "high",
           "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
           "-r", str(fps), "-movflags", "+faststart", out_path]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    t0 = time.time()
    with sync_playwright() as p:
        browser, page = open_page(p)
        for i in range(n):
            t = i / fps
            page.evaluate("t => window.renderAt(t)", t)
            buf = page.screenshot(type="jpeg", quality=96)
            proc.stdin.write(buf)
            if i % 60 == 0:
                print(f"frame {i}/{n} {time.time() - t0:.1f}s", flush=True)
        browser.close()
    proc.stdin.close()
    proc.wait()
    print("video", out_path, n, f"{time.time() - t0:.1f}s")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("mode", choices=["stills", "single", "video"])
    ap.add_argument("--times", default="")
    ap.add_argument("--out", required=True)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--dur", type=float, default=27.0)
    ap.add_argument("--cols", type=int, default=6)
    ap.add_argument("--cell", type=int, default=300)
    a = ap.parse_args()
    if a.mode == "stills":
        stills([float(x) for x in a.times.split(",")], a.out, a.cols, a.cell)
    elif a.mode == "single":
        single(float(a.times), a.out)
    else:
        video(a.out, a.fps, a.dur)
