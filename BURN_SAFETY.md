# Burn-sikkerhed: Agenten brænder KUN lige købte tokens

## Flow (kort)

1. Agenten claimer fees (SOL) fra creator vault
2. Hele beløbet → buyback + LP (efter strategi)
3. Agenten brænder **kun** det den lige har købt

---

## Detaljeret flow: doBuyback()

```
TRIN 1: balanceBefore = antal tokens agenten allerede har
        (inkl. tokens du holdt FØR boten startede)

TRIN 2: Agenten køber tokens med treasury-SOL (buyback)

TRIN 3: balanceAfter = antal tokens agenten har nu

TRIN 4: boughtAmount = balanceAfter - balanceBefore
        = KUN de tokens agenten lige købte

TRIN 5: Brænd boughtAmount (aldrig balanceBefore)
```

**Eksempel:**
- Du har 10.000 tokens i agent-wallet (købt manuelt før bot)
- balanceBefore = 10.000
- Buyback køber 500 tokens
- balanceAfter = 10.500
- boughtAmount = 500
- Agenten brænder 500 (ikke 10.500)
- Dine 10.000 er uændrede

---

## Kode (website/src/lib/agent/run.ts)

```typescript
const balanceBefore = await getTokenBalance(connection, agentTokenAta);

// Køb tokens
// ... buyback transaktion ...

const balanceAfter = await getTokenBalance(connection, agentTokenAta);
const boughtAmount = BigInt(Math.max(0, Number(balanceAfter) - Number(balanceBefore)));

if (boughtAmount > BigInt(0)) {
  const burnIx = createBurnInstruction(..., boughtAmount, ...);
  // ...
}
```

---

## Edge cases

| Scenario | Resultat |
|----------|----------|
| Agenten har 0 tokens før | balanceBefore=0, burn = alt vi købte |
| Agenten har 1000 fra før | balanceBefore=1000, burn = kun ny køb |
| Buy returnerer 0 tokens | boughtAmount=0, ingen burn |
| ATA findes ikke | getTokenBalance returnerer 0 |

---

## Bekræftelse

Implementationen i `website/src/lib/agent/run.ts` bruger denne logik:
- balanceBefore
- buy
- balanceAfter
- burn(balanceAfter - balanceBefore)

**Dine tokens fra før agenten startede er sikre.**
