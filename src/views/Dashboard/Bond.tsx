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
import ExchangeStat from '../Bond/components/ExchangeStat';
import TokenSymbol from '../../components/TokenSymbol';
import { Grid, Card, CardContent, Button } from '@material-ui/core';



const Bond: React.FC = () => {
  const tBondStats = useBondStats();
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
      <Grid item xs={12} sm={12} style={{ paddingTop: '10px' }}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ marginTop: '1%' }}>

              <div className="conthalf">
                <span>
                  <h2 style={{ textAlign: 'left', margin: '5px', paddingRight: '10px' }}>
                  <TokenSymbol symbol="BBOND" />{' '} Bonds
                  </h2>
                  <p style={{ marginTop: '0px', marginLeft: '5px' }}>BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1</p>
                </span>
              </div>

              <div className="contain">
                <div className="column">
                  <p style={{ fontSize: '13px' }}>Current Price: (Bomb)^2</p>
                  <p style={{ fontSize: '23px', fontWeight: 'bold' }}>
                    <ExchangeStat
                    description= ""
                      tokenName="10,000 BBOND"
                      price={Number(tBondStats?.tokenInFtm).toFixed(4) || '-'}
                    />
                  </p>
                </div>
                <div className="column">
                  <p style={{ fontSize: '13px' }}>Available to redeem:</p>
                  <p style={{ fontSize: '23px', fontWeight: 'bold' }}>${getDisplayBalance(bondBalance)}</p>
                </div>
                <div className="column">
                  <div className="conthalf" >
                    <span>
                      <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>Purchase BBond</p>
                      {!isBondPurchasable ? (
                        <p>Bomb is over peg</p>
                      ): (<></>)}
                    </span>
                    <span>
                    {!isBondPurchasable ? (
                    <>
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
                    </span>
                  </div>
                  <hr></hr>

                  <div className="conthalf" >
                    <span>
                      <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>Redeem Bomb</p>
                    </span>
                    <span>
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
                    </span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </Grid>
    </>
  );
};




export default Bond;
