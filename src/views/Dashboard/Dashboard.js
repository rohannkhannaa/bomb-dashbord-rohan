// THIS IS THE MAIN FILE FOR DASHBOARD :)
// Rohan
// IIT Ropar Btech CSE
// Entry Number : 2020CSB1117
import './Dashboard.css';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import moment from 'moment';
import { getDisplayBalance } from '../../utils/formatBalance';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import useBombFinance from '../../hooks/useBombFinance'; // Imported bombFinance to use fuiunctions
import usebShareStats from '../../hooks/usebShareStats';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';
import Bond from './Bond';
// import { Bomb as bombTesting } from '../../bomb-finance/deployments/deployments.testing.json';
//import { Bomb as bombProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import { roundAndFormatNumber } from '../../0x';
import { Button, Card, CardContent, Grid } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
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
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useHarvestFromBoardroom from '../../hooks/useHarvestFromBoardroom';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';
import useBanks from '../../hooks/useBanks';
import FarmCard from './FarmCard';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';

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

const Home = () => {
  function handleClickDiscord() {
    window.location.href = 'https://discord.bomb.money';
  }
  function handleClickReadDocs() {
    window.location.href = 'https://docs.bomb.money/welcome-start-here/readme';
  }
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
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );

  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );

  const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
  const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

  const [onDissmissBombZap] = useModal(
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

  const [onDissmissBshareZap] = useModal(
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
  const [approveStatus, approve] = useApprove(bombFinance.  BSHARE, bombFinance.contracts.Boardroom.address);
  const tokenBalance = useTokenBalance(bombFinance.BSHARE);
  const stakedBalance = useStakedBalanceOnBoardroom();
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
  // const isOldBoardroomMember = boardroomVersion !== 'latest';
  const canWithdraw = useWithdrawCheck();
  const { onRedeem } = useRedeemOnBoardroom();
  const { onStake } = useStakeToBoardroom();
  const { onWithdraw } = useWithdrawFromBoardroom();
  const canWithdrawFromBoardroom = useWithdrawCheck();
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);

  // For bomb farms on dashboard :
  const [banks] = useBanks();
  const activeBanks = banks.filter((bank) => !bank.finished);
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
  const cashPrice = useCashPriceInLastTWAP();
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
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
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
    const TVL = useTotalValueLocked();
  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: 'center', verticalAlign: 'middle' }}></Grid>
        {/* Explanation text */}
        {/* TVL */}
        <Grid item xs={12} sm={13}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>Bomb Finance Summary</h2>
              <hr />
              <div className="parent" style={{ justifyContent: 'space-between' }}>
                <div className="left child1" style={{ margin: '5px 5px 100px 5px' }}>
                  <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}></th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Current Suply</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Total Supply</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderTop: '1px solid #ddd' }}>
                        <td style={{alignContent:'center' , padding: '10px', borderBottom: '1px solid #ddd', verticalAlign: 'center' }}>
                          <TokenSymbol symbol="BOMB" />
                          <p style={{ display: 'inline', verticalAlign: 'center' }}>$BOMB</p>
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                          ${roundAndFormatNumber(bombCirculatingSupply * bombPriceInDollars, 2)}
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                          {roundAndFormatNumber(bombCirculatingSupply, 2)}
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                          ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'}
                          <br />{bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC
                        </td>
                      </tr>
                      <tr style={{ borderTop: '1px solid #ddd' }}>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                          <TokenSymbol symbol="BSHARE" />
                          <p style={{ display: 'inline', verticalAlign: 'center' }}>$BSHARE</p>
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                          ${roundAndFormatNumber((bShareCirculatingSupply * bSharePriceInDollars).toFixed(2), 2)}
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                          {roundAndFormatNumber(bShareCirculatingSupply, 2)}
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        ${bSharePriceInDollars ? bSharePriceInDollars : '-.--'}
                          <br/>
                          {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB
                        </td>
                      </tr>
                      <tr style={{ borderTop: '1px solid #ddd' }}>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                          <TokenSymbol symbol="BBOND" />{' '}
                          <p style={{ display: 'inline', verticalAlign: 'center' }}>$BBOND</p>
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                          ${roundAndFormatNumber((tBondCirculatingSupply * tBondPriceInDollars).toFixed(2), 2)}
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                          {roundAndFormatNumber(tBondCirculatingSupply, 2)}
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        ${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}
                        <br/>
                          {tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTC
                        <br/>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="right child2" style={{ marginRight: '4%' }}>
                  <p style={{ fontSize: 'large', padding: '0px', margin: '2px' }}>
                    Current EPOCH
                    <br />
                  </p>
                  <p style={{ fontSize: 'xx-large', padding: '0px', margin: '2px' }}>{Number(currentEpoch)}</p>
                  <hr />
                  <p style={{ fontSize: 'xx-large', margin: '2px' }}>
                    <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                  </p>
                  <p style={{ fontSize: 'large', margin: '2px' }}>Next EPOCH in</p>
                  <hr />
                  <p>Live TWAP: <span style= {{color : 'rgba(0, 232, 162, 1)'}}>{bondScale}</span></p>
                  <p>TVL: <span style={{color : 'rgba(0, 232, 162, 1)'}}>${TVL}</span> </p>
                  <p>Last Epoch TWAP:<span>{}</span> </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4} style={{ width: '25%', height: '3%' }}>
          <Card>
            <CardContent align="center" style={{ display: 'flex', flexDirection: 'column', padding: '0' }}>
              <p
                style={{
                  flex: 1,
                  width: '100%',
                  background:
                    'radial-gradient(59345.13% 4094144349.28% at 39511.5% -2722397851.45%, rgba(0, 245, 171, 0.5) 0%, rgba(0, 173, 232, 0.5) 100%)',
                  margin: '0',
                }}
              >
                INVEST NOW
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleClickDiscord} style={{ flex: 1, width: '100%', backgroundColor: 'grey' }}>
                  Chat on Discord
                </button>
                <button onClick={handleClickReadDocs} style={{ flex: 1, width: '100%', backgroundColor: 'grey' }}>
                  Read docs
                </button>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {!!account ? (
          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent align="center" style={{ position: 'relative' }}>
                <div style={{ display: 'flex' }}>
                  <div class="left">
                    <TokenSymbol symbol="BSHARE" />
                  </div>
                  <div class="right">
                    <h3 style={{ display: 'inline' }}>Board room . . . . </h3>
                    <p style={{ background: 'rgba(0, 232, 162, 0.5)', borderRadius: '3px', display: 'inline' }}>
                      {' '}
                      Recommened
                    </p>
                    <hr />
                    <p>Stake BSHARE and earn BOMB every epoch</p>
                    {/*  yha rehta */}
                    <p>TVL :{TVL}</p>
                    <p>Total staked: {getDisplayBalance(totalStaked)}</p>
                    <hr />
                    <p>Daily returns :</p>
                    {boardroomAPR.toFixed(2) / 365}%
                    <p>
                      <hr/>
                      Your stake :
                      <Value value={getDisplayBalance(stakedBalance)} />
                      <Label text={`≈ $${tokenPriceInDollars}`} variant="yellow" />
                      <Label text={'BSHARE Staked'} variant="yellow" />
                    </p>
                    <hr/>
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

        {/* Details only shown after account Login, else user asked to connect wallet first */}
        {!!account ? (
          <>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardContent style={{ position: 'relative' }}>
                  <h2>BOMB FARMS</h2>
                  <hr />
                  
                  <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 3)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <FarmCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                  <hr />
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          <></>
        )}

        {/* BONDSHARE */}
        {!!account ? (
          <>
            <Bond />
          </>
        ) : (
          <></>
        )}
      </Grid>
    </Page>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

export default Home;
