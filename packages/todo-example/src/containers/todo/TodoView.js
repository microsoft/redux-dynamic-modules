import AddTodo from './AddTodo';
import React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import VisibleTodoList from './VisibleTodoList';
import Footer from '../../components/todo/Footer';
import { getTodoModule } from '../../modules/todo/todoModule';

const TodoView = () => (
          <DynamicModuleLoader modules={[getTodoModule()]}>
            <div>Todo View</div>
            <AddTodo />
            <VisibleTodoList />
            <Footer />
          </DynamicModuleLoader>
     )
  
export default TodoView
