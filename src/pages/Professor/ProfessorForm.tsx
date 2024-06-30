import {
  FormControl,
  FormLabel,
  Input,
  Select,
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

interface Department {
  id: number;
  name: string;
}

const schema = z.object({
  name: z.string().min(3),
  cpf: z.string().min(1).max(11),
  dptId: z.string().min(1),
});

export default function ProfessorForm() {
  const { id } = useParams();
  const { data: professor } = useSWR(id ? `professors/${id}` : null);
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
    if (professor) {
      setValue('name', professor.name);
      setValue('cpf', professor.cpf);
      setValue('dptId', professor?.department?.id);
    }
  }, [professor]);

  async function onSubmit(form: any) {
    const response = await fetch(
      `${env.VITE_BACKEND_URL}/professors${id ? `/${id}` : ''}`,
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
      description: `${id ? 'Updated' : 'Created'} professor`,
      title: 'Your request is completed successfully',
      status: 'success',
    });

    navigate('/professor');
  }

  const { data: departments = [] } = useSWR<Department[]>('departments');

  console.log(errors);

  return (
    <Page title={`${id ? 'Update' : 'Create'} Professor`}>
      <Stack gap={41}>
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Professor Name</FormLabel>
          <Input type='text' {...register('name')} />
          <FormHelperText>Collaborator Name</FormHelperText>
          <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.cpf}>
          <FormLabel>Professor CPF</FormLabel>
          <Input type='text' {...register('cpf')} />
          <FormErrorMessage>{errors?.cpf?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Department</FormLabel>
          <Select
            placeholder='Select...'
            {...register('dptId')}
            isInvalid={!!errors.dptId}
          >
            {departments.map((department, index) => (
              <option key={index} value={department.id}>
                {department.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors?.dptId?.message}</FormErrorMessage>
        </FormControl>

        <Stack display='flex' flexDirection='row'>
          <Button as={Link} to='/professor'>
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
