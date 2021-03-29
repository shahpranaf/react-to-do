import React from 'react';
import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import Todo from '../Todo';

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.

// afterEach(cleanup);
describe('should add, select tasks', () => {
 
    afterEach(cleanup);

    test('should add new task and priority', () => {
        const {queryByTestId, getByTestId, queryByRole} = render(<Todo />);
        
        expect(queryByTestId('newTask')).toBeTruthy();
        expect(queryByTestId('priority')).toBeTruthy();
      
        const newTask = getByTestId('newTask')
        const priority = getByTestId('priority')

        expect(newTask.value).toBe("");
        expect(priority.value).toBe("low");
      
        fireEvent.change(newTask, {target: { value: "Task 1"}});
        fireEvent.change(priority, {target: { value: "high"}});
      
        expect(newTask.value).toBe("Task 1");
        expect(priority.value).toBe("high");

        const addTaskBtn = getByTestId(/add-button/i);
        UserEvent.click(addTaskBtn);
  
        const firstList = queryByRole('listitem', { 'name': 'list0'})
        const addedTask = within(firstList).queryByLabelText('taskText')
        const addedPriority = within(firstList).queryByLabelText('priority')

        expect(addedTask.textContent).toBe("Task 1");
        expect(addedPriority.textContent).toBe("high");
      });

    test('should select task', async () => {
      window.localStorage.clear()

      const {queryByTestId, getByTestId, queryByRole, queryByText} = render(<Todo />);
      expect(queryByTestId('newTask')).toBeTruthy();
      expect(queryByTestId('priority')).toBeTruthy();
    
      const newTask = getByTestId('newTask')
      const priority = getByTestId('priority')

      expect(newTask.value).toBe("");
      expect(priority.value).toBe("low");
    
      fireEvent.change(newTask, {target: { value: "Task 2"}});
      fireEvent.change(priority, {target: { value: "medium"}});
    
      expect(newTask.value).toBe("Task 2");
      expect(priority.value).toBe("medium");

      const addTaskBtn = getByTestId(/add-button/i);
      UserEvent.click(addTaskBtn);

      const firstList = queryByRole('listitem', { 'name': 'list0'})
      const addedTask = within(firstList).queryByLabelText('taskText')
      const addedPriority = within(firstList).queryByLabelText('priority')

      expect(addedTask.textContent).toBe("Task 2");
      expect(addedPriority.textContent).toBe("medium");


      const selectFirstTask = within(firstList).queryByRole('checkbox', { 'name': 'selectTask'});

      expect(selectFirstTask).not.toBeChecked();
      expect(queryByRole('button', { 'name': 'deleteAll'})).toHaveClass('invisible');
      
      UserEvent.click(selectFirstTask);

      expect(selectFirstTask).toBeChecked();

      expect(queryByRole('button', { 'name': 'deleteAll'})).not.toHaveClass('invisible');

      expect(queryByText('1 Selected')).toBeTruthy();
    });

});
