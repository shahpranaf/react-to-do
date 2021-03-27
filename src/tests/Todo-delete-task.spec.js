import React from "react";
import { cleanup, fireEvent, render, screen, waitFor, within, act } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";
import Todo from "../Todo";

describe.only("should delete All & selected tasks ", () => {
    beforeEach(() => window.localStorage.clear())
    afterEach(cleanup);
    
	test("should delete single task", async () => {
		const { getByTestId, queryAllByRole } = render(<Todo />);

		const newTask = getByTestId("newTask");
		const priority = getByTestId("priority");

		expect(newTask.value).toBe("");
		expect(priority.value).toBe("low");

        fireEvent.change(newTask, {target: { value: "Task 1"}});
        fireEvent.change(priority, {target: { value: "medium"}});
        UserEvent.click(getByTestId(/add-button/i));

        const allItems = queryAllByRole("list-item", { name: /list/i });
        expect(queryAllByRole("list-item", { name: /list/i }).length).toBe(1);
        
        const deleteBtn = within(allItems[0]).queryByRole('button', { 'name': 'delete0'})
        UserEvent.click(deleteBtn);

        expect(queryAllByRole("list-item", { name: /list/i }).length).toBe(0);
    });

    test("should delete All tasks", async () => {
		const { getByTestId, queryAllByRole, findByTestId, queryByRole } = render(<Todo />);

		const newTask = getByTestId("newTask");
		const priority = getByTestId("priority");

		expect(newTask.value).toBe("");
		expect(priority.value).toBe("low");

        fireEvent.change(newTask, {target: { value: "Task 1"}});
        fireEvent.change(priority, {target: { value: "medium"}});
        await waitFor( async() => {
            UserEvent.click(await findByTestId(/add-button/i));
        })

        const allItems = queryAllByRole("list-item", { name: /list/i });
        expect(queryAllByRole("list-item", { name: /list/i }).length).toBe(1);
        
        const selectFirstTask = within(allItems[0]).queryByRole('checkbox', { 'name': 'selectTask'});
        UserEvent.click(selectFirstTask);

        const deleteAllBtn = queryByRole('button', { 'name': 'deleteAll'});
        UserEvent.click(deleteAllBtn);

        expect(queryAllByRole("list-item", { name: /list/i }).length).toBe(0);
    });
    
  
});
