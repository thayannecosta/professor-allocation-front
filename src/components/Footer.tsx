import {
    Box,
    Container,
    Stack,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  // import { Link as ReactRouterLink } from 'react-router-dom';
  // import NAV_ITEMS from '../utils/routes.utils';  
  export default function SmallCentered() {
    return (
      <Box
        width={'100%'}
        bottom={0}
        position={'fixed'}
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}
      >
        <Box
          borderTopWidth={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Container
            as={Stack}
            maxW={'6xl'}
            py={4}
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}
          >
            <Text>
              © {new Date().getFullYear()} ThayRuhLylly. Todos os direitos reservados.
            </Text>
            <Stack direction={'row'} spacing={6}>
            </Stack>
          </Container>
        </Box>
      </Box>
    );
  }
  