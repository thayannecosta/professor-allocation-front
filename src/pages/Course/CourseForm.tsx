import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
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
  name: z.string().min(3),
});

export default function CourseForm() {
  const { id } = useParams();
  const { data: course } = useSWR(id ? `courses/${id}` : null);
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
    if (course) {
      setValue('name', course.name);
    }
  }, [course, setValue]);

  async function onSubmit(form: any) {
    // Verifica se o nome já existe
    const isDuplicate = courses.some(
      (course: any) => course.name.toLowerCase() === form.name.toLowerCase()
    );

    if (isDuplicate) {
      return toast({
        status: 'error',
        title: 'Duplicate Course',
        description: 'A course with this name already exists.',
      });
    }

    const response = await fetch(
      `${env.VITE_BACKEND_URL}/courses${id ? `/${id}` : ''}`,
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
      description: `${id ? 'Updated' : 'Created'} course`,
      title: 'Your request is completed successfully',
      status: 'success',
    });

    navigate('/courses');
  }

  return (
    <Page title={`${id ? 'Update' : 'Create'} Course`}>
      <Stack gap={4}>
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Course Name</FormLabel>
          <Input type='text' {...register('name')} />
          <FormHelperText>Enter the name of the course</FormHelperText>
          <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
        </FormControl>

        <Stack display='flex' flexDirection='row'>
          <Button as={Link} to='/courses'>
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
