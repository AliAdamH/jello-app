import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleDueDate, updateTask } from './taskSlice';

function DueDateEditor() {
  const currentDueDate = useSelector((state) => state.tasks.task.dueDate);
  const dispatch = useDispatch();
  const dateRef = useRef(null);
  const dateReminderRef = useRef(null);

  const handleDueDateChange = (e) => {
    console.log(e.target.value);
  };

  const handleDueDateSave = () => {
    dispatch(
      handleDueDate({
        dueDate: dateRef.current.value,
        dueDateReminder: dateReminderRef.current.value,
      })
    );
    dispatch(updateTask());
    console.log(dateRef.current.value, dateReminderRef.current.value);
  };

  return (
    <>
      <div>DueDate {currentDueDate ? currentDueDate : 'No due dates.'}</div>
      <input
        ref={dateRef}
        type={'date'}
        name="due_date"
        onChange={handleDueDateChange}
      />
      <select ref={dateReminderRef} name="due_date_reminder" defaultValue={''}>
        <option value={''} disabled>
          Select a due date reminder
        </option>
        <option value="1">1 day before</option>
        <option value="2">2 days before</option>
      </select>
      <button onClick={handleDueDateSave}>Save</button>
    </>
  );
}

export default DueDateEditor;
