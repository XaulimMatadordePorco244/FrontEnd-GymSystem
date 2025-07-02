import instrutoresForm from './instrutoresForm'
import instrutoresList from './instrutoresList'

function InstructorsPage() {
  return (
    <>
      <h2>Cadastro de Instrutores</h2>
      <InstructorsForm />
      <hr />
      <h2>Lista de Instrutores</h2>
      <InstructorsList />
    </>
  )
}

export default InstructorsPage;
