import React from 'react';
import styled from 'styled-components';
import { Link as RRouterLink } from 'react-router-dom';
import { Text, Flex, Button, Avatar, Link } from '@chakra-ui/react';

function Navbar() {
  return (
    <>
      <Flex
        as="nav"
        w={'full'}
        position="fixed"
        h={14}
        top={0}
        p={2}
        bg="blackAlpha.400"
        alignItems={'center'}
      >
        <Text fontSize={'xl'}>Jello</Text>
        <Flex ml={'auto'} gap={2} alignItems={'center'}>
          <Flex p={4} gap={2} alignItems="center">
            <Link as={RRouterLink} to="/">
              Home
            </Link>
            <Link as={RRouterLink} to="/board">
              Board
            </Link>
          </Flex>
          <Avatar name={'Ali Adam'} size={'sm'}></Avatar>
        </Flex>
      </Flex>
    </>
  );
}

export default Navbar;
