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
  dayOfWeek: z.string().nonempty(),
  startHour: z.string().nonempty(),
  endHour: z.string().nonempty(),
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
      setValue('dayOfWeek', allocation.dayOfWeek);
      setValue('startHour', allocation.startHour);
      setValue('endHour', allocation.endHour);
      setValue('professorId', allocation.professorId);
      setValue('courseId', allocation.courseId);
    }
  }, [allocation, setValue]);

  async function onSubmit(form: any) {
    const hasConflict = allocations.some(
      (alloc: any) =>
        alloc.professorId === form.professorId &&
        alloc.dayOfWeek === form.dayOfWeek &&
        ((alloc.startHour <= form.startHour && form.startHour < alloc.endHour) ||
         (alloc.startHour < form.endHour && form.endHour <= alloc.endHour))
    );

    if (hasConflict) {
      return toast({
        status: 'error',
        title: 'Schedule Conflict',
        description: 'The selected professor is already allocated at this time.',
      });
    }

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

    navigate('/allocations');
  }

  return (
    <Page title={`${id ? 'Update' : 'Create'} Allocation`}>
      <Stack gap={4}>
        <FormControl isRequired isInvalid={!!errors.dayOfWeek}>
          <FormLabel>Day of Week</FormLabel>
          <Select {...register('dayOfWeek')}>
            <option value="">Select a day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </Select>
          <FormErrorMessage>{errors?.dayOfWeek?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.startHour}>
          <FormLabel>Start Hour</FormLabel>
          <Input type='time' {...register('startHour')} />
          <FormErrorMessage>{errors?.startHour?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.endHour}>
          <FormLabel>End Hour</FormLabel>
          <Input type='time' {...register('endHour')} />
          <FormErrorMessage>{errors?.endHour?.message}</FormErrorMessage>
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
          <Button as={Link} to='/allocations'>
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
