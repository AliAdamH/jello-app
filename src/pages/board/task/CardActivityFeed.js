import React from 'react';
import { FaChartBar } from 'react-icons/fa';
import { Avatar, Flex, Heading, Icon, Input, Text } from '@chakra-ui/react';

function CardActivityFeed() {
  return (
    <Flex maxH={'320px'} overflowY="auto" direction={'column'} gap={4}>
      <Flex alignItems={'center'} gap={2}>
        <Heading as="h3" fontSize={'md'}></Heading>
        <Icon as={FaChartBar} /> Activity
      </Flex>
      <Flex gap={2} alignItems={'center'}>
        <Avatar size={'sm'} />
        <Input
          placeholder="Comment..."
          p={2}
          w="full"
          borderRadius={'md'}
          _focus={{
            bg: 'white',
          }}
        />
      </Flex>
      <Flex gap={2} alignItems={'center'}>
        <Avatar size={'sm'} />
        <Text px={2} fontSize="sm">
          Hello this is some fancy activity text we can even write very long
          text to see where it goes Hello this is some fancy activity text we
          can even write.
        </Text>
      </Flex>

      <Flex gap={2} alignItems={'center'}>
        <Avatar name={'Ali Adam'} size={'sm'} />
        <Text px={2} fontSize="sm">
          Moved this card from First Column to Second Column
        </Text>
      </Flex>
    </Flex>
  );
}

export default CardActivityFeed;
