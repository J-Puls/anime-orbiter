import { forwardRef } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

export const UserInfoUpdateForm = forwardRef((props, ref) => {
  return (
    <>
      <label htmlFor={props.id} className="lead">
        {props.label}
      </label>
      <InputGroup className="mb-3">
        <Form.Control
          ref={ref}
          size="lg"
          id={props.id}
          aria-label={props.ariaLabel}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          disabled={props.disabled}
        />
        <InputGroup.Append>
          <Button
            disabled={props.disabled}
            onClick={props.onClick}
            variant="success"
          >
            Save
          </Button>
        </InputGroup.Append>
      </InputGroup>
      {props.formText.type && (
        <Form.Text className={`text-${props.formText.type}`}>
          {props.formText.message}
        </Form.Text>
      )}
    </>
  );
});

export default UserInfoUpdateForm;
