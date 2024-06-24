import Page from '../../components/Page';
import ListView from '../../components/ListView';

function Course() {
  return (
    <Page title='Courses'>
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
    </Page>
  );
}

export default Course;
