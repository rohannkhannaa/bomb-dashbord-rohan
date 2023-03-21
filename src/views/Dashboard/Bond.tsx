import React, { useCallback, useMemo } from 'react';
import ExchangeCard from './components/ExchangeCard';
import useBondStats from '../../hooks/useBondStats';
//import useBombStats from '../../hooks/useBombStats';
import useBombFinance from '../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import TokenSymbol from '../../components/TokenSymbol';

import { Grid, Card, CardContent, Button } from '@material-ui/core';



const Bond: React.FC = () => {
  const bombFinance = useBombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  //const bombStat = useBombStats();
  const cashPrice = useCashPriceInLastTWAP();
  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(bombFinance?.BBOND);
  //const scalingFactor = useMemo(() => (cashPrice ? Number(cashPrice) : null), [cashPrice]);

  // Added here

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
      });
    },
    [bombFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} BBOND` });
    },
    [bombFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
  // console.log("bondstat", Number(bondStat?.tokenInFtm))

  return (
    <>
      <Grid item xs={12} sm={12}>
        <Card>
          <CardContent style={{ position: 'inherit' }}>
            <div style={{ display: 'flex' }}>
              <div className="left">
                <TokenSymbol symbol="BSHARE" />
              </div>
              <div className="right">
                <h3>Bonds</h3>
                <p>BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1</p>
                {/*  yha rehta */}
                <p>Current Price = (BOMB)^2</p>
                <p>BBond ={Number(bondStat?.tokenInFtm).toFixed(4) || '-'} BTC</p>
                <p>Available to redeem :{`${getDisplayBalance(bondBalance)} BBOND Available in wallet`}</p>
                <hr />
                <div className="purchase">
                  {!isBondPurchasable ? (
                    <>
                      <p>Bomb is Over Peg</p>
                      <Button disabled>Purchase</Button>
                    </>
                  ) : (
                    <>
                      <ExchangeCard
                        action="Purchase"
                        fromToken={bombFinance.BOMB}
                        fromTokenName="BOMB"
                        toToken={bombFinance.BBOND}
                        toTokenName="BBOND"
                        priceDesc={
                          !isBondPurchasable
                            ? 'BOMB is over peg'
                            : getDisplayBalance(bondsPurchasable, 18, 4) + ' BBOND available for purchase'
                        }
                        onExchange={handleBuyBonds}
                        disabled={!bondStat || isBondRedeemable}
                      />
                    </>
                  )}
                </div>
                <div className="redeem">
                  <ExchangeCard
                    action="Redeem"
                    fromToken={bombFinance.BBOND}
                    fromTokenName="BBOND"
                    toToken={bombFinance.BOMB}
                    toTokenName="BOMB"
                    priceDesc={`${getDisplayBalance(bondBalance)} BBOND Available in wallet`}
                    onExchange={handleRedeemBonds}
                    disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                    disabledDescription={
                      !isBondRedeemable ? `Redeem Enabled when 10,000 BOMB > ${BOND_REDEEM_PRICE}BTC` : null
                    }
                  />
                </div>
                <hr />
                <div className="redeem"></div>
              </div>
            </div>
            <hr />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};




export default Bond;
