import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))
        page.on("dialog", lambda dialog: dialog.accept())

        # The vite server usually starts on port 5173
        await page.goto("http://localhost:5173/dashboard")
        await expect(page).to_have_title("Dashboard")
        await page.screenshot(path="jules-scratch/verification/dashboard-light.png")

        # Toggle dark mode
        await page.get_by_role('checkbox').check()
        await page.screenshot(path="jules-scratch/verification/dashboard-dark.png")

        # Navigate to map
        await page.goto("http://localhost:5173/map")
        await page.wait_for_selector(".leaflet-container")
        await page.screenshot(path="jules-scratch/verification/map.png")

        # Navigate to chatbot
        await page.goto("http://localhost:5173/chatbot")
        await page.screenshot(path="jules-scratch/verification/chatbot.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
