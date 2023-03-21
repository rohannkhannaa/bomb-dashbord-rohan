import React, { useCallback, useMemo } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
//import useBombStats from '../../hooks/useBombStats';
import useBombFinance from '../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import { Alert } from '@material-ui/lab';
import TokenSymbol from '../../components/TokenSymbol';

import HomeImage from '../../assets/img/background.jpg';
import { Grid, Box, Card, CardContent, Button } from '@material-ui/core';
import { Helmet } from 'react-helmet';

import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useCatchError from '../../hooks/useCatchError';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | Bonds';

const Bond: React.FC = () => {
  const { path } = useRouteMatch();
  const bombFinance = useBombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  //const bombStat = useBombStats();
  const cashPrice = useCashPriceInLastTWAP();
  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(bombFinance?.BBOND);
  //const scalingFactor = useMemo(() => (cashPrice ? Number(cashPrice) : null), [cashPrice]);

  // Added here
  const catchError = useCatchError();
  const {
    contracts: { Treasury },
  } = useBombFinance();
  const fromToken = bombFinance.BOMB;
  const fromTokenName = 'BOMB';
  const [approveStatus, approve] = useApprove(fromToken, Treasury.address);

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
  const isBondPayingPremium = useMemo(() => Number(bondStat?.tokenInFtm) >= 1.1, [bondStat]);
  // console.log("bondstat", Number(bondStat?.tokenInFtm))
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);

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

const StyledBond = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Bond;
