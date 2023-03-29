import React, { useEffect, useMemo, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Box, Button, Card, CardActions, CardContent, Typography, Grid } from '@material-ui/core';
import { AddIcon, RemoveIcon } from '../../components/icons';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import IconButton from '../../components/IconButton';
import TokenSymbol from '../../components/TokenSymbol';
import useStatsForPool from '../../hooks/useStatsForPool';
import useRedeem from '../../hooks/useRedeem';
import useEarnings from '../../hooks/useEarnings';
import useHarvest from '../../hooks/useHarvest';
import useBombStats from '../../hooks/useBombStats';
import useShareStats from '../../hooks/usebShareStats';
import useStakedBalance from '../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import useTokenBalance from '../../hooks/useTokenBalance';
import useWithdraw from '../../hooks/useWithdraw';
import { getDisplayBalance } from '../../utils/formatBalance';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import ZapModal from './ZapModal';
import useModal from '../../hooks/useModal';
import useStake from '../../hooks/useStake';
import useZap from '../../hooks/useZap';
import './css/FarmCard.css';
const FarmCard = ({ bank }) => {
  let depositToken = bank.depositTokenName.toUpperCase();
  if (depositToken === '80BOMB-20BTCB-LP') {
    depositToken = 'BOMB-MAXI';
  }
  if (depositToken === '80BSHARE-20WBNB-LP') {
    depositToken = 'BSHARE-MAXI';
  }

  // For importing specific details :
  useEffect(() => window.scrollTo(0, 0));
  const { onRedeem } = useRedeem(bank);
  let statsOnPool = useStatsForPool(bank);

  // Staked
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);
  const { color: themeColor } = useContext(ThemeContext);
  const tokenBalance = useTokenBalance(bank.depositToken);
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);
  const tokenPriceInDollars2 = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const earnedInDollars2 = (
    Number(tokenPriceInDollars2) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))
  ).toFixed(2);
  const { onStake } = useStake(bank);
  const { onZap } = useZap(bank);
  const { onWithdraw } = useWithdraw(bank);
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const { onReward } = useHarvest(bank);
  const bombStats = useBombStats();
  const tShareStats = useShareStats();

  const tokenStats = bank.earnTokenName === 'BSHARE' ? tShareStats : bombStats;
  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentZap, onDissmissZap] = useModal(
    <ZapModal
      decimals={bank.depositToken.decimal}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onZap(zappingToken, tokenName, amount);
        onDissmissZap();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  return (
    <>
      {/* Since BBOND is also in activeBanks but it is not to be included in recommended section of bomb farms so removed it. */}
      {bank.depositTokenName === 'BBOND' ? (
        <></>
      ) : (
        <Grid item xs={12} md={12} lg={12}>
          <Card variant="outlined">
            <CardContent>
              <Box style={{ position: 'relative' }}>
                <Box
                  style={{
                    position: 'absolute',
                    right: '0px',
                    top: '-5px',
                    height: '48px',
                    width: '48px',
                    borderRadius: '40px',
                    backgroundColor: '#363746',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                ></Box>
                <div className="parent" style={{ justifyContent: 'space-between' }}>
                  <div className="left child1">
                    <Typography variant="h5" component="h2" style={{ display: 'inline', marginRight: '2rem' }}>
                      <TokenSymbol size={32} symbol={bank.depositTokenName} />
                      {bank.depositTokenName}
                    </Typography>
                    <p style={{ background: 'rgba(0, 232, 162, 0.5)', borderRadius: '3px', display: 'inline' }}>
                      {' '}
                      Recommended
                    </p>
                    <Typography color="textSecondary">
                      {/* {bank.name} */}
                      <hr />
                    </Typography>
                  </div>
                  <div className="right child2">
                    <p className="boardRoomContent">TVL : {statsOnPool?.TVL}</p>
                  </div>
                </div>
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: 'flex-end' }}>
              <p className="boardRoomContent">
                Daily Returns
                <br />
                {bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}
              </p>
              <p className="boardRoomContent">
                Your stake
                <br />${earnedInDollars2}
              </p>
              <p className="boardRoomContent">
                Earned
                <br />${earnedInDollars}
              </p>
              {/* Deposit button */}
              <div className="deposit">
                {approveStatus !== ApprovalState.APPROVED ? (
                  <Button
                    disabled={
                      bank.closedForStaking ||
                      approveStatus === ApprovalState.PENDING ||
                      approveStatus === ApprovalState.UNKNOWN
                    }
                    onClick={approve}
                    className={
                      bank.closedForStaking ||
                      approveStatus === ApprovalState.PENDING ||
                      approveStatus === ApprovalState.UNKNOWN
                        ? 'shinyButtonDisabled'
                        : 'shinyButton'
                    }
                  >
                    {`Deposit`}
                  </Button>
                ) : (
                  <>
                    <IconButton onClick={onPresentWithdraw}>
                      <RemoveIcon />
                    </IconButton>
                    <StyledActionSpacer />
                    <IconButton
                      disabled={
                        bank.closedForStaking ||
                        bank.depositTokenName === 'BOMB-BSHARE-LP' ||
                        bank.depositTokenName === 'BOMB' ||
                        bank.depositTokenName === 'BOMB-BTCB-LP' ||
                        bank.depositTokenName === '80BOMB-20BTCB-LP' ||
                        bank.depositTokenName === '80BSHARE-20WBNB-LP' ||
                        bank.depositTokenName === 'BUSM-BUSD-LP' ||
                        bank.depositTokenName === 'BBOND'
                      }
                      onClick={() => (bank.closedForStaking ? null : onPresentZap())}
                    >
                      <FlashOnIcon style={{ color: themeColor.grey[400] }} />
                    </IconButton>
                    <StyledActionSpacer />
                    <IconButton
                      disabled={bank.closedForStaking}
                      onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}
                    >
                      <AddIcon />
                    </IconButton>
                  </>
                )}
              </div>

              {/* Withdraw Button */}
              <div className="withdraw">
                <Button onClick={onRedeem} className="shinyButtonSecondary">
                  Withdraw
                </Button>
              </div>

              {/* Claim Rewards */}
              <div className="claimReward">
                <Button
                  onClick={onReward}
                  disabled={earnings.eq(0)}
                  className={earnings.eq(0) ? 'shinyButtonDisabled' : 'shinyButton'}
                >
                  Claim
                </Button>
              </div>
            </CardActions>
          </Card>
        </Grid>
      )}
    </>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

export default FarmCard;
