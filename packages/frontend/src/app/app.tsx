import { Route, Routes } from 'react-router-dom';
import TodoHome from './todo-home';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<TodoHome />} />
    </Routes>
  );
}

export default App;
