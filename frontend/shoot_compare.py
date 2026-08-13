"""Compare HTML prototype vs React landing page side by side."""
from playwright.sync_api import sync_playwright
import os

OUT = "C:\\Users\\Devesh B\\OneDrive\\Documents\\DEVESH\\Main project\\arges-platform\\frontend"

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)

    # HTML Prototype
    page = ctx.new_page()
    page.goto("http://localhost:8765/index.html", wait_until="domcontentloaded")
    page.wait_for_timeout(6000)  # wait for 3D + splash
    page.screenshot(path=os.path.join(OUT, "compare_prototype.png"))
    print("Prototype captured.")

    # React version
    page.goto("http://localhost:5173/", wait_until="domcontentloaded")
    page.wait_for_timeout(4000)
    page.screenshot(path=os.path.join(OUT, "compare_react.png"))
    print("React captured.")

    # Scroll down on both for comparison
    page.goto("http://localhost:8765/index.html", wait_until="domcontentloaded")
    page.wait_for_timeout(3000)
    page.evaluate("window.scrollTo(0, 1400)")
    page.wait_for_timeout(2000)
    page.screenshot(path=os.path.join(OUT, "compare_prototype_eco.png"))
    print("Prototype ecosystem captured.")

    page.goto("http://localhost:5173/", wait_until="domcontentloaded")
    page.wait_for_timeout(3000)
    page.evaluate("window.scrollTo(0, 1400)")
    page.wait_for_timeout(2000)
    page.screenshot(path=os.path.join(OUT, "compare_react_eco.png"))
    print("React ecosystem captured.")

    browser.close()
print("Done.")
