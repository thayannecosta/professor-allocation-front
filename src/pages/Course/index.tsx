import Page from '../../components/Page';
import ListView from '../../components/ListView';
import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Course() {
  return (
    <Page title='Course' rightNode={
      <Button as={Link} to='/course/create' colorScheme='facebook' mr={10}>
        New Course
      </Button>
    }>
      
      <ListView
        resource='courses'
        tableProps={{
          columns: [
            {
              key: 'id',
              label: 'ID',
            },
            {
              key: 'name',
              label: 'Name',
            },
          ],
        }}
      />
    <br />
    <b>* Cursos com allocation já definidas não podem ser deletados.</b>
    </Page>
  );
}

export default Course;
