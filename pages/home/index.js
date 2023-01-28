/* eslint-disable no-nested-ternary */
import React, {useEffect} from 'react'
import {
  Box,
  PopoverTrigger,
  Stack,
  Text,
  Button,
  useBreakpointValue,
  useClipboard,
  useDisclosure,
  Flex,
} from '@chakra-ui/react'
import {useTranslation} from 'react-i18next'
import {useQuery, useQueryClient} from 'react-query'
import {useRouter} from 'next/router'
import {Page} from '../../screens/app/components'
import {
  UserProfileCard,
  UserStatList,
  UserStatistics,
  ActivateMiningForm,
  KillForm,
  AnnotatedUserStatistics,
  WideLink,
  MyIdenaBotAlert,
  ActivateInvitationPanel,
  AcceptInvitationPanel,
  StartIdenaJourneyPanel,
  AcceptInviteOnboardingContent,
  ActivateInviteOnboardingContent,
  StartIdenaJourneyOnboardingContent,
  ActivateInvitationDialog,
  UserStat,
  UserStatLabel,
  UserStatValue,
  ReplenishStakeDrawer,
  StakingAlert,
  AdCarousel,
  SpoilInviteDrawer,
} from '../../screens/home/components'
import Layout from '../../shared/components/layout'
import {IdentityStatus, OnboardingStep} from '../../shared/types'
import {
  toPercent,
  toLocaleDna,
  eitherState,
  openExternalUrl,
  useIsDesktop,
} from '../../shared/utils/utils'
import {useIdentity} from '../../shared/providers/identity-context'
import {useEpoch} from '../../shared/providers/epoch-context'
import {fetchBalance} from '../../shared/api/wallet'
import {useAuthState} from '../../shared/providers/auth-context'
import {
  ExternalLink,
  MobileApiStatus,
  TextLink,
  Tooltip,
} from '../../shared/components/components'
import {useOnboarding} from '../../shared/providers/onboarding-context'
import {
  OnboardingPopover,
  OnboardingPopoverContent,
} from '../../shared/components/onboarding'
import {onboardingShowingStep} from '../../shared/utils/onboarding'
import {useScroll} from '../../shared/hooks/use-scroll'
import {
  AddUserIcon,
  ChevronRightIcon,
  AdsIcon,
  CopyIcon,
  DeleteIcon,
  OpenExplorerIcon,
  OracleIcon,
  PhotoIcon,
  TestValidationIcon,
  PooIcon,
  InfoIcon,
} from '../../shared/components/icons'
import {useFailToast, useSuccessToast} from '../../shared/hooks/use-toast'
import {isValidDnaUrl} from '../../screens/dna/utils'
import {useStakingApy, useValidationResults} from '../../screens/home/hooks'
import {ValidationReportSummary} from '../../screens/validation-report/components'
import {useAppContext} from '../../shared/providers/app-context'
import {useRotatingAds} from '../../screens/ads/hooks'

export default function HomePage() {
  const queryClient = useQueryClient()

  const {
    t,
    i18n: {language},
  } = useTranslation()

  const [identity] = useIdentity()

  const {
    address,
    state,
    online,
    delegatee,
    delegationEpoch,
    pendingUndelegation,
    canMine,
    canInvite,
    canTerminate,
    canActivateInvite,
  } = identity

  const router = useRouter()

  const epoch = useEpoch()
  const {privateKey} = useAuthState()
  const userStatAddress = useBreakpointValue([
    address ? `${address.substr(0, 3)}...${address.substr(-4, 4)}` : '',
    address,
  ])

  const [showValidationResults, setShowValidationResults] = React.useState()

  const {onCopy} = useClipboard(address)
  const successToast = useSuccessToast()

  const {
    isOpen: isOpenKillForm,
    onOpen: onOpenKillForm,
    onClose: onCloseKillForm,
  } = useDisclosure()

  const {
    data: {balance, stake, replenishedStake},
  } = useQuery(['get-balance', address], () => fetchBalance(address), {
    initialData: {balance: 0, stake: 0, replenishedStake: 0},
    enabled: !!address,
    refetchInterval: 30 * 1000,
  })

  const [validationResultSeen, setValidationResultSeen] = useValidationResults()

  useEffect(() => {
    if (epoch) {
      const {epoch: epochNumber} = epoch
      if (epochNumber) {
        queryClient.invalidateQueries('get-balance')
        setShowValidationResults(!validationResultSeen)
      }
    }
  }, [epoch, queryClient, validationResultSeen])

  const [dnaUrl] = React.useState(() =>
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('dnaUrl'))
      : null
  )

  React.useEffect(() => {
    if (dnaUrl) {
      if (isValidDnaUrl(dnaUrl.route))
        router.push({pathname: dnaUrl.route, query: dnaUrl.query})
      sessionStorage.removeItem('dnaUrl')
    }
  }, [dnaUrl, router])

  const toDna = toLocaleDna(language, {maximumFractionDigits: 4})

  const [
    currentOnboarding,
    {dismissCurrentTask, next: nextOnboardingTask},
  ] = useOnboarding()

  const eitherOnboardingState = (...states) =>
    eitherState(currentOnboarding, ...states)

  const {
    isOpen: isOpenActivateInvitePopover,
    onOpen: onOpenActivateInvitePopover,
    onClose: onCloseActivateInvitePopover,
  } = useDisclosure()

  const activateInviteDisclosure = useDisclosure()

  const activateInviteRef = React.useRef()

  const {scrollTo: scrollToActivateInvite} = useScroll(activateInviteRef)

  React.useEffect(() => {
    if (
      isOpenActivateInvitePopover ||
      eitherState(
        currentOnboarding,
        onboardingShowingStep(OnboardingStep.StartTraining),
        onboardingShowingStep(OnboardingStep.ActivateInvite)
      )
    ) {
      scrollToActivateInvite()
      onOpenActivateInvitePopover()
    } else onCloseActivateInvitePopover()
  }, [
    currentOnboarding,
    isOpenActivateInvitePopover,
    onCloseActivateInvitePopover,
    onOpenActivateInvitePopover,
    scrollToActivateInvite,
  ])

  const canSubmitFlip = [
    IdentityStatus.Verified,
    IdentityStatus.Human,
    IdentityStatus.Newbie,
  ].includes(state)

  const [{idenaBotConnected}, {persistIdenaBot, skipIdenaBot}] = useAppContext()

  const shouldStartIdenaJourney = currentOnboarding.matches(
    OnboardingStep.StartTraining
  )
  const onboardingPopoverPlacement = useBreakpointValue(['top', 'bottom'])

  const replenishStakeDisclosure = useDisclosure()

  const {
    onOpen: onOpenReplenishStakeDisclosure,
    onClose: onCloseReplenishStakeDisclosure,
  } = replenishStakeDisclosure

  React.useEffect(() => {
    if (Object.keys(router.query).find(q => q === 'replenishStake')) {
      onOpenReplenishStakeDisclosure()
      router.push('/home')
    }
  }, [onOpenReplenishStakeDisclosure, router])

  const failToast = useFailToast()

  const toast = useSuccessToast()

  const stakingApy = useStakingApy()

  const ads = useRotatingAds()

  const isDesktop = useIsDesktop()

  const spoilInviteDisclosure = useDisclosure()

  const showActivateMiningStatusIcon = canMine && !online && !delegatee
  const showValidateIdentityIcon = !canMine && Number(stake) > 0

  return (
    <Layout canRedirect={!dnaUrl} didConnectIdenaBot={idenaBotConnected}>
      
      <Page pt="10" position="relative">
        <MobileApiStatus top={idenaBotConnected ? 4 : 5 / 2} left={4} />
        <Stack
          w={['100%', '480px']}
          direction={['column', 'row']}
          spacing={['6', 10]}
        >
          <Box>
            <Stack
              spacing={[1, 8]}
              w={['100%', '480px']}
              align={['center', 'initial']}
              ref={activateInviteRef}
            >
              <UserProfileCard
                identity={identity}
                my={[4, 0]}
              ></UserProfileCard>

              {canActivateInvite && (
                <Box w={['100%', 'initial']} pb={[8, 0]}>
                  <OnboardingPopover
                    isOpen={isOpenActivateInvitePopover}
                    placement={onboardingPopoverPlacement}
                  >
                    <PopoverTrigger>
                      {shouldStartIdenaJourney ? (
                        <StartIdenaJourneyPanel
                          onHasActivationCode={activateInviteDisclosure.onOpen}
                        />
                      ) : state === IdentityStatus.Invite ? (
                        <AcceptInvitationPanel />
                      ) : (
                        <ActivateInvitationPanel />
                      )}
                    </PopoverTrigger>
                    {shouldStartIdenaJourney ? (
                      <StartIdenaJourneyOnboardingContent
                        onDismiss={() => {
                          dismissCurrentTask()
                          onCloseActivateInvitePopover()
                        }}
                      />
                    ) : state === IdentityStatus.Invite ? (
                      <AcceptInviteOnboardingContent
                        onDismiss={() => {
                          dismissCurrentTask()
                          onCloseActivateInvitePopover()
                        }}
                      />
                    ) : (
                      <ActivateInviteOnboardingContent
                        onDismiss={() => {
                          dismissCurrentTask()
                          onCloseActivateInvitePopover()
                        }}
                      />
                    )}
                  </OnboardingPopover>
                </Box>
              )}

              {showValidationResults && (
                <ValidationReportSummary
                  onClose={() => setValidationResultSeen()}
                />
              )}

              
              <Stack><big style={{color: 'blue'}}> www.idena.io Доброго вечера</big></Stack>
            </Stack>
            
          </Box>

          <Stack spacing={[0, 10]} flexShrink={0} w={['100%', 200]}>
            {address && privateKey && canMine && (
              <Box minH={62} mt={[1, 6]}>
                <OnboardingPopover
                  isOpen={eitherOnboardingState(
                    onboardingShowingStep(OnboardingStep.ActivateMining)
                  )}
                >
                  
                  <OnboardingPopoverContent
                    title={t('Activate mining status')}
                    onDismiss={nextOnboardingTask}
                  >
                    <Text>
                      {t(
                        `To become a validator of Idena blockchain you can activate your mining status. Keep your node online to mine iDNA coins.`
                      )}
                    </Text>
                  </OnboardingPopoverContent>
                </OnboardingPopover>
              </Box>
            )}
            
          </Stack>
        </Stack>

        <KillForm isOpen={isOpenKillForm} onClose={onCloseKillForm}></KillForm>

        <ActivateInvitationDialog {...activateInviteDisclosure} />

        <ReplenishStakeDrawer
          {...replenishStakeDisclosure}
          onMined={onCloseReplenishStakeDisclosure}
          onError={failToast}
        />

        <SpoilInviteDrawer
          {...spoilInviteDisclosure}
          onSuccess={() => {
            successToast(t('Invitation is successfully spoiled'))
            spoilInviteDisclosure.onClose()
          }}
          onFail={failToast}
        />
      </Page>
    </Layout>
  )
}
