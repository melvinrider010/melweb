import asyncio
import sys

# Force UTF-8 on Windows stdout
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        
        page.on("console", lambda msg: sys.stdout.write(f"BROWSER CONSOLE: [{msg.type}] {msg.text}\n"))
        
        # Navigate to /departments/bca
        print("Navigating to http://localhost:5173/departments/bca...")
        await page.goto("http://localhost:5173/departments/bca")
        
        # Immediate screenshot (150ms) to check if page is visible under loader
        await page.wait_for_timeout(150)
        await page.screenshot(path="scripts/bca_underlying_page_visible.png")
        print("Captured scripts/bca_underlying_page_visible.png")
        
        # Check hero video
        hero_video = await page.evaluate("""() => {
            const v = document.querySelector('video[src*="department-hero-loop"]');
            return v ? { src: v.src, paused: v.paused, muted: v.muted } : null;
        }""")
        print("Hero video status:", hero_video)
        
        # Wait 2 seconds for all queries to settle
        await page.wait_for_timeout(2000)
        await page.screenshot(path="scripts/bca_final_loaded.png")
        print("Captured scripts/bca_final_loaded.png")
        
        # Check if loader disappeared
        loader_present = await page.evaluate("""() => {
            const el = document.querySelector('[role="status"]');
            return !!el;
        }""")
        print("Loader still present after 2s:", loader_present)
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
