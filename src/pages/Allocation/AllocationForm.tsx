import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Button,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Link, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import Page from '../../components/Page';
import { useEffect } from 'react';
import env from '../../utils/env';
import z from 'zod';

const schema = z.object({
  day: z.string().nonempty(),
  start: z.string().nonempty(),
  end: z.string().nonempty(),
  professorId: z.string().nonempty(),
  courseId: z.string().nonempty(),
});

export default function AllocationForm() {
  const { id } = useParams();
  const { data: allocation } = useSWR(id ? `allocations/${id}` : null);
  const { data: allocations = [] } = useSWR('allocations');
  const { data: professors = [] } = useSWR('professors');
  const { data: courses = [] } = useSWR('courses');
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (allocation) {
      setValue('day', allocation.day);
      setValue('start', allocation.start);
      setValue('end', allocation.end);
      setValue('professorId', String(allocation.professor.id));
      setValue('courseId', String(allocation.course.id));
    }
  }, [allocation, setValue]);

  async function onSubmit(form: any) {
    const hasConflict = allocations.some(
      (alloc: any) =>
        alloc.professorId === form.professorId &&
        alloc.day === form.day &&
        ((alloc.start <= form.start && form.start < alloc.end) ||
         (alloc.start < form.end && form.end <= alloc.end))
    );

    if (hasConflict) {
      return toast({
        status: 'error',
        title: 'Schedule Conflict',
        description: 'The selected professor is already allocated at this time.',
      });
    }

    form.start = `${form.start.substring(0, 5)}:00`
    form.end = `${form.end.substring(0, 5)}:00`

    const response = await fetch(
      `${env.VITE_BACKEND_URL}/allocations${id ? `/${id}` : ''}`,
      {
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
        method: id ? 'PUT' : 'POST',
      }
    );

    if (!response.ok) {
      return toast({
        status: 'error',
        title: `Something went wrong`,
        description: `Was not possible to complete your request`,
      });
    }

    toast({
      description: `${id ? 'Updated' : 'Created'} allocation`,
      title: 'Your request is completed successfully',
      status: 'success',
    });

    navigate('/allocation');
  }

  return (
    <Page title={`${id ? 'Update' : 'Create'} Allocation`}>
      <Stack gap={4}>
        <FormControl isRequired isInvalid={!!errors.day}>
          <FormLabel>Day of Week</FormLabel>
          <Select {...register('day')}>
            <option value="">Select a day</option>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
            <option value="SATURDAY">Saturday</option>
            <option value="SUNDAY">Sunday</option>
          </Select>
          <FormErrorMessage>{errors?.day?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.start}>
          <FormLabel>Start Hour</FormLabel>
          <Input type='time' {...register('start')} />
          <FormErrorMessage>{errors?.start?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.end}>
          <FormLabel>End Hour</FormLabel>
          <Input type='time' {...register('end')} />
          <FormErrorMessage>{errors?.end?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.professorId}>
          <FormLabel>Professor</FormLabel>
          <Select {...register('professorId')}>
            <option value="">Select a professor</option>
            {professors.map((professor: any) => (
              <option key={professor.id} value={professor.id}>
                {professor.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors?.professorId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.courseId}>
          <FormLabel>Course</FormLabel>
          <Select {...register('courseId')}>
            <option value="">Select a course</option>
            {courses.map((course: any) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors?.courseId?.message}</FormErrorMessage>
        </FormControl>

        <Stack display='flex' flexDirection='row'>
          <Button as={Link} to='/allocation'>
            Cancel
          </Button>
          <Button colorScheme='facebook' onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Page>
  );
}
