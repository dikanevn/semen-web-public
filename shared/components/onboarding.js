/* eslint-disable react/prop-types */
import React from 'react'
import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  Stack,
  useTheme,
} from '@chakra-ui/react'
import {useTranslation} from 'react-i18next'
import {openExternalUrl} from '../utils/utils'

export function OnboardingPopover({children, ...props}) {
  return (
    <>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {props.isOpen && (
        <Box
          bg="xblack.080"
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={2}
          css={{margin: '0!important', padding: '0!important'}}
        />
      )}
      <Popover closeOnBlur={false} {...props}>
        {children}
      </Popover>
    </>
  )
}

export function OnboardingPopoverContent({
  title,
  additionFooterActions,
  children,
  onDismiss,
  ...props
}) {
  const {t} = useTranslation()

  return (
    <PopoverContent
      bg="blue.500"
      border="none"
      color="white"
      px={3}
      py={2}
      zIndex="popover"
      {...props}
    >
      <PopoverArrow bg="blue.500" boxShadow="none !important" />
      <Box p={2}>
        <Stack spacing={3}>
          <PopoverHeader
            borderBottom="none"
            fontWeight={500}
            fontSize="md"
            p={0}
            mb={0}
          >
            {title}
          </PopoverHeader>
          <PopoverBody fontSize="sm" p={0}>
            {children}
          </PopoverBody>
          <PopoverFooter as={Stack} border="none" p={0}>
            <Stack isInline spacing={6} justify="flex-end">
              {additionFooterActions}
              <Button variant="unstyled" onClick={onDismiss}>
                {t('Okay, got it')}
              </Button>
            </Stack>
          </PopoverFooter>
        </Stack>
      </Box>
    </PopoverContent>
  )
}

export function OnboardingPopoverContentIconRow({icon, children, ...props}) {
  return (
    <Stack isInline spacing={4} align="center" {...props}>
      {icon}
      <Box color="white">{children}</Box>
    </Stack>
  )
}

export function OnboardingLinkButton({
  href,
  onClick = () => openExternalUrl(href),
  ...props
}) {
  const {colors} = useTheme()
  return (
    <Button
      variant="link"
      color="white"
      fontSize="sm"
      fontWeight="normal"
      verticalAlign="baseline"
      textDecoration={`underline ${colors.xwhite['040']}`}
      minW={0}
      _hover={null}
      _active={null}
      _focus={null}
      onClick={onClick}
      {...props}
    />
  )
}
