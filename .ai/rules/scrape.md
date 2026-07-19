Run Sovereign command family `/scrape`.

Show this menu and ask me to choose one option before executing:
1) `all competitors blog` -> runs `/scrape all competitors blog`
2) `all competitors projects` -> runs `/scrape all competitors projects`
3) `all competitors all website` -> runs `/scrape all competitors all website`
4) `competitor website` -> runs `/scrape [name] website`
5) `competitor all website` -> runs `/scrape [name] all website`

If option 4 or 5 is selected, ask for competitor slug from `content/sovereign/scraped/index.json`.
Then execute the selected router command and respond using the workspace command output format.
