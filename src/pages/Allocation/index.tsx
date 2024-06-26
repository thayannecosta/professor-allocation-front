import Page from '../../components/Page';
import ListView from '../../components/ListView';
import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Allocation() {
  return (
    <Page title='Allocations' rightNode={
      <Button as={Link} to='/allocation/create' colorScheme='facebook' mr={10}>
        New Allocation
      </Button>
    }>
      <ListView
        resource='allocations'
        tableProps={{
          columns: [
            {
              key: 'id',
              label: 'ID',
            },
            {
              key: 'day',
              label: 'Day Of Week',
            },
            {
              key: 'start',
              label: 'Start Hour',
            },
            {
              key: 'end',
              label: 'End Hour',
            },
            {
              key: 'professor',
              label: 'Professor',
              render: (professor) => {
                return professor.name;
              },
            },
            {
              key: 'course',
              label: 'Course',
              render: (course) => {
                return course.name;
              },
            },
          ],
        }}
      />
    </Page>
  );
}

export default Allocation;
