import {TriangleUpIcon} from '@chakra-ui/icons'
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useSwipeable} from 'react-swipeable'
import {
  Avatar,
  HDivider,
  SmallText,
  SuccessAlert,
} from '../../../shared/components/components'
import {InfoIcon} from '../../../shared/components/icons'
import {useLanguage} from '../../../shared/hooks/use-language'
import {AdBurnKey} from '../../../shared/models/adBurnKey'
import {useIsDesktop} from '../../../shared/utils/utils'
import {AdImage} from '../../ads/components'
import {useBurntCoins, useFormatDna, useRotateAds} from '../../ads/hooks'

export function ValidationAdPromotion() {
  const {t} = useTranslation()

  const {lng} = useLanguage()

  const {ads, currentIndex, setCurrentIndex, prev, next} = useRotateAds()

  const currentAd = ads[currentIndex]

  const {data: burntCoins} = useBurntCoins()

  const orderedBurntCoins =
    burntCoins
      ?.sort((a, b) => b.amount - a.amount)
      .map(burn => ({...burn, ...AdBurnKey.fromHex(burn?.key)})) ?? []

  const maybeBurn = orderedBurntCoins.find(burn => burn.cid === currentAd?.cid)

  const formatDna = useFormatDna()

  const swipeProps = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  const burnDuration = new Intl.RelativeTimeFormat(lng, {
    style: 'short',
  }).format(24, 'hour')

  const isDesktop = useIsDesktop()

  if (ads.length > 0) {
    if (!isDesktop)
      return (
        <Stack spacing="2">
          <Stack
            spacing="6"
            bg="gray.500"
            borderRadius="lg"
            fontSize="base"
            p="6"
          >
            <Stack spacing="3">
              <Stack spacing="2">
                <Heading fontSize="lg" fontWeight={500}>
                  {currentAd?.title}
                </Heading>
                <Text fontSize={['mdx', null]} color="muted">
                  {currentAd?.desc}
                </Text>
              </Stack>
              <Link
                href={currentAd?.url}
                target="_blank"
                noOfLines={2}
                color="blue.500"
                fontWeight={500}
                maxW="255px"
              >
                {currentAd?.url}
              </Link>
            </Stack>
            <LinkBox>
              <LinkOverlay href={currentAd?.url} isExternal>
                <AdImage src={currentAd?.media} w="255px" />
              </LinkOverlay>
            </LinkBox>
            <Stack spacing="2" divider={<HDivider borderColor="xwhite.010" />}>
              <AdStat label={t('Sponsored by')} spacing="1.5">
                <AdStatValue as={HStack} spacing="2" align="center">
                  <Avatar
                    address={currentAd?.author}
                    boxSize="6"
                    borderRadius="lg"
                  />
                  <Text as="span" color="muted" fontSize="base" noOfLines={1}>
                    {currentAd?.author}
                  </Text>
                </AdStatValue>
              </AdStat>
              <AdStat
                label={t('Burnt, {{time}}', {time: burnDuration})}
                spacing="1.5"
              >
                <AdStatValue
                  as="span"
                  color="muted"
                  fontSize="base"
                  noOfLines={1}
                >
                  {formatDna(maybeBurn?.amount ?? 0)}
                </AdStatValue>
              </AdStat>
            </Stack>
          </Stack>

          <HStack spacing="0.5" justify="center" align="center" py="3">
            {ads.map((ad, idx) => {
              const isCurrrent = currentIndex === idx

              return (
                <Button
                  key={ad.cid}
                  variant="unstyled"
                  bg={isCurrrent ? 'muted' : 'rgb(150 153 158 /.3)'}
                  borderRadius="1px"
                  h="0.5"
                  w="6"
                  onClick={() => {
                    setCurrentIndex(idx)
                  }}
                />
              )
            })}
          </HStack>

          <SuccessAlert
            icon={<InfoIcon color="green.500" boxSize="5" mr="2" />}
            fontSize="md"
          >
            {t('Watching ads makes your coin valuable!')}
          </SuccessAlert>
        </Stack>
      )

    return (
      <Stack spacing="4">
        <Box position="relative">
          <AdNavButton
            icon={<TriangleUpIcon transform="rotate(-90deg)" />}
            position="absolute"
            left="-12"
            top="50%"
            transform="translateY(-50%)"
            onClick={prev}
          />
          <Box bg="gray.500" borderRadius="lg" p="10" w="full">
            <Stack direction="row" spacing="8" {...swipeProps}>
              <LinkBox>
                <LinkOverlay href={currentAd?.url} isExternal>
                  <AdImage src={currentAd?.media} w="212px" h="212px" />
                </LinkOverlay>
              </LinkBox>
              <Stack spacing="7">
                <Stack spacing="5">
                  <Stack spacing="1.5" width="xs">
                    <Stack spacing="2">
                      <Heading
                        as="h3"
                        fontSize="md"
                        fontWeight={500}
                        noOfLines={1}
                      >
                        {currentAd?.title}
                      </Heading>
                      <Text color="muted" noOfLines={2}>
                        {currentAd?.desc}
                      </Text>
                    </Stack>
                    <Link
                      href={currentAd?.url}
                      target="_blank"
                      color="blue.500"
                      fontWeight={500}
                      noOfLines={2}
                    >
                      {currentAd?.url}
                    </Link>
                  </Stack>
                  <Stack direction="row" spacing="8">
                    <AdStat label={t('Sponsored by')} maxW="24">
                      <AdStatValue as={HStack} spacing="1" align="center">
                        <Avatar
                          address={currentAd?.author}
                          boxSize="4"
                          borderRadius="sm"
                        />
                        <Text as="span" isTruncated>
                          {currentAd?.author}
                        </Text>
                      </AdStatValue>
                    </AdStat>
                    <AdStat
                      label={t('Burnt, {{time}}', {time: burnDuration})}
                      value={formatDna(maybeBurn?.amount ?? 0)}
                    />
                  </Stack>
                </Stack>
                <SuccessAlert
                  icon={<InfoIcon color="green.500" boxSize="5" mr="3" />}
                  fontSize="md"
                >
                  {t('Watching ads makes your coin valuable!')}
                </SuccessAlert>
              </Stack>
            </Stack>
          </Box>
          <AdNavButton
            icon={<TriangleUpIcon transform="rotate(90deg)" />}
            position="absolute"
            right="-12"
            top="50%"
            transform="translateY(-50%)"
            onClick={next}
          />
        </Box>
        <HStack spacing="2.5" justify="center" align="center" h="2">
          {ads.map((ad, idx) => {
            const isCurrrent = currentIndex === idx

            const isSibling = Math.abs(currentIndex - idx) === 1

            // eslint-disable-next-line no-nested-ternary
            const boxSize = isCurrrent ? '2' : isSibling ? '1.5' : '1'

            return (
              <Button
                key={ad.cid}
                variant="unstyled"
                bg={
                  // eslint-disable-next-line no-nested-ternary
                  isCurrrent
                    ? 'white'
                    : isSibling
                    ? 'transparent'
                    : 'xwhite.016'
                }
                borderColor="xwhite.016"
                borderWidth={isSibling ? 2 : 0}
                rounded="full"
                boxSize={boxSize}
                minW={boxSize}
                onClick={() => {
                  setCurrentIndex(idx)
                }}
              />
            )
          })}
        </HStack>
      </Stack>
    )
  }

  return null
}

function AdStat({label, value, children, ...props}) {
  return (
    <Stack spacing="1.5" {...props}>
      <Text fontWeight={500} lineHeight="4">
        {label}
      </Text>
      {value && <AdStatValue>{value}</AdStatValue>}
      {children}
    </Stack>
  )
}

function AdStatValue(props) {
  return <SmallText fontWeight={500} lineHeight={[null, '14px']} {...props} />
}

function AdNavButton(props) {
  return (
    <IconButton
      variant="unstyled"
      size="sm"
      color="xwhite.050"
      _hover={{
        color: 'white',
      }}
      transition="all 0.2s ease-out"
      {...props}
    />
  )
}
