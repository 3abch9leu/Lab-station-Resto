# Board photos (in-store menu boards)

Put the two original board photos here, full resolution, as:

- `tacos-board.jpg`  → the "SIGNATURE TACOS" board
- `burgers-board.jpg` → the "SIGNATURE BURGER" board

Then run:

```bash
npm run photos:board
```

The script crops every dish photo out of the boards into `public/photos/`
and writes `public/photos/MAPPING.txt` with the lines to paste into
`data/menu.ts` (LOCAL_PHOTOS).

If the crops are slightly off, adjust the fraction boxes in
`scripts/crop-board.mjs` and re-run — it is non-destructive.
