import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 800, "height": 600})
        
        # Test 1: Contrasting Red Background
        html_red = """
        <!DOCTYPE html>
        <html>
        <body style="margin:0; background: red; display: flex; align-items: center; justify-content: center; height: 100vh;">
            <video src="http://localhost:5173/assets/videos/site-loader-transparent.webm" autoplay muted loop playsinline style="width: 320px; height: 320px; object-fit: cover;"></video>
        </body>
        </html>
        """
        await page.set_content(html_red)
        await page.wait_for_timeout(800)
        await page.screenshot(path="scripts/test_transparency_red.png")
        print("Captured scripts/test_transparency_red.png")
        
        # Test 2: Contrasting Patterned / Navy Background
        html_navy = """
        <!DOCTYPE html>
        <html>
        <body style="margin:0; background: #0B1F4E; display: flex; align-items: center; justify-content: center; height: 100vh;">
            <video src="http://localhost:5173/assets/videos/site-loader-transparent.webm" autoplay muted loop playsinline style="width: 320px; height: 320px; object-fit: cover;"></video>
        </body>
        </html>
        """
        await page.set_content(html_navy)
        await page.wait_for_timeout(800)
        await page.screenshot(path="scripts/test_transparency_navy.png")
        print("Captured scripts/test_transparency_navy.png")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
