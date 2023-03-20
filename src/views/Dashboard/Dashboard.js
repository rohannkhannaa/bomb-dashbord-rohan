import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import moment from 'moment';
import { getDisplayBalance } from '../../utils/formatBalance';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import useBombFinance from '../../hooks/useBombFinance'; // Imported bombFinance to use fuiunctions
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';

// import { Bomb as bombTesting } from '../../bomb-finance/deployments/deployments.testing.json';
//import { Bomb as bombProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import { roundAndFormatNumber } from '../../0x';
import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import { makeStyles } from '@material-ui/core/styles';
//import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet';
//import useBombMaxiStats from '../../hooks/useBombMaxiStats';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import ProgressCountdown from './components/ProgressCountdown';

import HomeImage from '../../assets/img/background.jpg';

import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import useUnstakeTimerBoardroom from '../../hooks/boardroom/useUnstakeTimerBoardroom';
import useStakeToBoardroom from '../../hooks/useStakeToBoardroom';
import useWithdrawFromBoardroom from '../../hooks/useWithdrawFromBoardroom';
import { AddIcon, RemoveIcon } from '../../components/icons';
import IconButton from '../../components/IconButton';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useTokenBalance from '../../hooks/useTokenBalance';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';
import Label from '../../components/Label';
import Value from '../../components/Value';
import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';

import CardIcon from '../../components/CardIcon';
import useClaimRewardTimerBoardroom from '../../hooks/boardroom/useClaimRewardTimerBoardroom';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useHarvestFromBoardroom from '../../hooks/useHarvestFromBoardroom';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';

const BackgroundImage = createGlobalStyle`
  body { 
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | BTC pegged algocoin';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: grey;
//     background-size: cover !important;
//   }
// `;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Home = () => {
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  // const bombmaxi = useBombMaxiStats('0xd6f52e8ab206e59a1e13b3d6c5b7f31e90ef46ef000200000000000000000028');

  // console.log(bombmaxi);
  // let bomb;
  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //   bomb = bombTesting;
  // } else {
  //   bomb = bombProd;
  // }

  const buyBombAddress = //'https://app.1inch.io/#/56/swap/BTCB/BOMB';
    //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=0x522348779DCb2911539e76A1042aA922F9C47Ee3';
  //https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBShareAddress = //'https://app.1inch.io/#/56/swap/BNB/BSHARE';
    'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBusmAddress =
    'https://app.bogged.finance/bsc/swap?tokenIn=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&tokenOut=0x6216B17f696B14701E17BCB24Ec14430261Be94A';
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
  const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'BOMB-BTCB-LP'}
    />,
  );

  const [onPresentBshareZap, onDissmissBshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBshareZap();
      }}
      tokenName={'BSHARE-BNB-LP'}
    />,
  );

  const [modal, setModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const openModal = () => {
    setModal(!modal);
  };

  const spinner = () => {
    setVideoLoading(!videoLoading);
  };

  // const [onPresentIntroVid] = useModal(
  //   <grid>
  //     <Paper>
  //       <div>
  //         <iframe
  //           width="560"
  //           height="315"
  //           src="https://www.youtube.com/embed/nhCWmmRNNhc"
  //           title="YouTube video player"
  //           frameborder="0"
  //           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //           allowfullscreen
  //         ></iframe>
  //       </div>
  //     </Paper>
  //   </grid>,
  // );

  // For Bomb Finance Summary
  const currentEpoch = useCurrentEpoch();

  // For BOARD ROOM on dashboard
  const totalStaked = useTotalStakedOnBoardroom();
  const { account } = useWallet();
  const bombFinance = useBombFinance();
  const [approveStatus, approve] = useApprove(bombFinance.BSHARE, bombFinance.contracts.Boardroom.address);
  const tokenBalance = useTokenBalance(bombFinance.BSHARE);
  const stakedBalance = useStakedBalanceOnBoardroom();
  const { from1, to1 } = useUnstakeTimerBoardroom();
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('BSHARE', bombFinance.BSHARE);
  const tokenPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
        : null,
    [stakedTokenPriceInDollars, stakedBalance],
  );

  const { to } = useTreasuryAllocationTimes();

  const { onReward } = useHarvestFromBoardroom();
  const earnings = useEarningsOnBoardroom();
  const canClaimReward = useClaimRewardCheck();

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
  const { from2, to2 } = useClaimRewardTimerBoardroom();
  // const isOldBoardroomMember = boardroomVersion !== 'latest';
  const canWithdraw = useWithdrawCheck();
  const { onRedeem } = useRedeemOnBoardroom();

  const { onStake } = useStakeToBoardroom();
  const { onWithdraw } = useWithdrawFromBoardroom();
  const canWithdrawFromBoardroom = useWithdrawCheck();

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'BShare'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'BShare'}
    />,
  );
  const boardroomAPR = useFetchBoardroomAPR();

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid
          item
          xs={12}
          sm={4}
          style={{ display: 'flex', justifyContent: 'center', verticalAlign: 'middle', overflow: 'hidden' }}
        ></Grid>
        {/* Explanation text */}
        {/* TVL */}
        <Grid item xs={12} sm={13}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              Bomb Finance Summary
              <hr />
              <div style={{ display: 'flex' }}>
                <div class="left">
                  <table>
                    <thead>
                      <td></td>
                      <td>Current Suply</td>
                      <td>Total Supply</td>
                      <td>Price</td>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <TokenSymbol symbol="BOMB" />
                          $BOMB
                        </td>
                        <td>${roundAndFormatNumber(bombCirculatingSupply * bombPriceInDollars, 2)}</td>
                        <td>{roundAndFormatNumber(bombCirculatingSupply, 2)}</td>
                        <td>{roundAndFormatNumber(bombTotalSupply, 2)}</td>
                      </tr>
                      <tr>
                        <td>
                          <TokenSymbol symbol="BSHARE" />
                          $BSHARE
                        </td>
                        <td>${roundAndFormatNumber((bShareCirculatingSupply * bSharePriceInDollars).toFixed(2), 2)}</td>
                        <td>{roundAndFormatNumber(bShareCirculatingSupply, 2)}</td>
                        <td>{roundAndFormatNumber(bShareTotalSupply, 2)}</td>
                      </tr>
                      <tr>
                        <td>
                          <TokenSymbol symbol="BBOND" /> $BBOND
                        </td>
                        <td>${roundAndFormatNumber((tBondCirculatingSupply * tBondPriceInDollars).toFixed(2), 2)}</td>
                        <td>{roundAndFormatNumber(tBondCirculatingSupply, 2)}</td>
                        <td>{roundAndFormatNumber(tBondTotalSupply, 2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="right">
                  <p>Current EPOCH : {Number(currentEpoch)} </p>
                  <hr />
                  <p>
                    Next EPOCH in :
                    <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                  </p>
                  <hr />
                  <p>Live TWAP: </p>
                  <p>TVL: </p>
                  <p>Last Epoch TWAP: </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <p>INVEST NOW</p>
              <button>Chat on Discord</button>
              <button>TRead docs</button>
            </CardContent>
          </Card>
        </Grid>

        {/* Details only shown after account Login, else user asked to connect wallet first */}
        {!!account ? (
          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent align="center" style={{ position: 'relative' }}>
                <div style={{ display: 'flex' }}>
                  <div class="left">
                    <TokenSymbol symbol="BSHARE" />
                  </div>
                  <div class="right">
                    <h3>Board room</h3>
                    <p>Stake BSHARE and earn BOMB every epoch</p>
                    {/*  yha rehta */}
                    <p>TVL :</p>
                    <p>Total staked: {getDisplayBalance(totalStaked)}</p>
                    <hr />
                    <p>Daily returns :</p>
                    {boardroomAPR.toFixed(2) / 365}%
                    <p>
                      Your stake :
                      <Value value={getDisplayBalance(stakedBalance)} />
                      <Label text={`≈ $${tokenPriceInDollars}`} variant="yellow" />
                      <Label text={'BSHARE Staked'} variant="yellow" />
                    </p>
                    <p>
                      Earned :
                      <Value value={getDisplayBalance(earnings)} />
                      <Label text={`≈ $${earnedInDollars}`} variant="yellow" />
                      <Label text="BOMB Earned" variant="yellow" />
                    </p>
                    <div class="Deposit">
                      {approveStatus !== ApprovalState.APPROVED ? (
                        <Button
                          disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                          className={
                            approveStatus === ApprovalState.NOT_APPROVED ? 'shinyButton' : 'shinyButtonDisabled'
                          }
                          style={{ marginTop: '20px' }}
                          onClick={approve}
                        >
                          Deposit
                        </Button>
                      ) : (
                        <>
                          <IconButton disabled={!canWithdrawFromBoardroom} onClick={onPresentWithdraw}>
                            <RemoveIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
                          </IconButton>
                          <StyledActionSpacer />
                          <IconButton onClick={onPresentDeposit}>
                            <AddIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
                          </IconButton>
                        </>
                      )}
                    </div>
                    <div className="withdraw">
                      <Button
                        disabled={stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                        onClick={onRedeem}
                        className={
                          stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)
                            ? 'shinyButtonDisabledSecondary'
                            : 'shinyButtonSecondary'
                        }
                      >
                        Withdraw
                      </Button>
                    </div>
                    <div className="claim">
                      <Button
                        onClick={onReward}
                        className={earnings.eq(0) || !canClaimReward ? 'shinyButtonDisabled' : 'shinyButton'}
                        disabled={earnings.eq(0) || !canClaimReward}
                      >
                        Claim Reward
                      </Button>
                    </div>
                  </div>
                </div>
                <hr />
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <UnlockWallet />
        )}

        {/* BSHARE */}

        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <div style={{ display: 'flex' }}>
                <div class="left">
                  <TokenSymbol symbol="BSHARE" />
                </div>
                <div class="right">
                  <h3>Board Farms</h3>
                  <p>Stake your LP tokens in our farms to start earning $BSHARE</p>
                  <Button>Claim all</Button>
                  {/*  yha rehta */}
                  <hr />
                  <div style={{ display: 'flex' }}>
                    <div class="left">
                      <TokenSymbol symbol="BSHARE" />
                    </div>
                    <div class="right">
                      <h5>BOMB-BTCB</h5>
                      <p>Recommended</p>
                      {/*  yha rehta */}
                      <p>TVL :</p>
                      <p>Daily returns :</p>
                      <p>Your stake :</p>
                      <p>Earned :</p>
                      <Button>Deposit</Button>
                      <Button>Withdraw</Button>
                      <Button>Claim rewards</Button>
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div class="left">
                      <TokenSymbol symbol="BSHARE" />
                    </div>
                    <div class="right">
                      <h5>BSHARE-BNB</h5>
                      <p>Recommended</p>
                      {/*  yha rehta */}
                      <p>TVL :</p>
                      <p>Daily returns :</p>
                      <p>Your stake :</p>
                      <p>Earned :</p>
                      <Button>Deposit</Button>
                      <Button>Withdraw</Button>
                      <Button>Claim rewards</Button>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <div style={{ display: 'flex' }}>
                <div class="left">
                  <TokenSymbol symbol="BSHARE" />
                </div>
                <div class="right">
                  <h3>Bonds</h3>
                  <p>BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1</p>
                  {/*  yha rehta */}
                  <p>BBOND = </p>
                  <p>Available to redeem :</p>
                  <Button>Purchase BBOND</Button>
                  <Button>Redeem BOMB</Button>
                </div>
              </div>
              <hr />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Home;
