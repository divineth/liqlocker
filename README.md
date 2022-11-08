## Specifying Supported Chain
1. Open src/connectors/index.ts.
2. Change defaultChainID in line 40 to prefered chainID.
3. Uncomment your preferred chain in the injected variable (Line 50)
3. Open src/components/Web3ReactManager/index.tsx.
4. Set the variable params (Line 62) to your preferred chain.

## Specifying Locker Contract
1. Open src/constants/addresses.ts.
2. Enter the locker address for your preferred chain in the LOCKER_ADDRESS object (Line 8).
Note: Add chain to the object if needed.

## Specifying Locker ABI
1. Open src/hooks/useContract.ts.
2. Import your ABI.
3. In line 201, replace SOLAR_LOCKER_ABI with your imported ABI.