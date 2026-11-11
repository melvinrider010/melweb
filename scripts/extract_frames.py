import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 720})
        await page.goto("http://localhost:5173/assets/videos/site-loader.mp4")
        duration = await page.evaluate("""() => {
            const v = document.querySelector('video');
            return v ? v.duration : 0;
        }""")
        print("Duration:", duration)
        
        times = [0.0, 0.5, 1.0, 1.5, 2.0, 3.0]
        for idx, t in enumerate(times):
            await page.evaluate(f"""() => {{
                const v = document.querySelector('video');
                if (v) {{
                    v.currentTime = {t};
                }}
            }}""")
            await page.wait_for_timeout(300)
            await page.screenshot(path=f"scripts/frame_{idx}.png")
            print(f"Captured scripts/frame_{idx}.png at {t}s")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
