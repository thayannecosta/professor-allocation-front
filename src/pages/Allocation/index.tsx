import Page from '../../components/Page';
import ListView from '../../components/ListView';

function Allocation() {
  return (
    <Page title='Allocations'>
      <ListView
        resource='allocations'
        tableProps={{
          columns: [
            {
              key: 'id',
              label: 'ID',
            },
            {
              label: 'Day Of Week',
              key: 'dayOfWeek',
            },
            {
              key: 'startHour',
              label: 'Start Hour',
            },
            {
              key: 'endHour',
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
