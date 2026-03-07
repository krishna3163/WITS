package com.message.chat.WITS.view;

import com.message.chat.WITS.service.UserService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;

@Route("register")
@PageTitle("Register | WITS Chat")
@AnonymousAllowed
public class RegistrationView extends VerticalLayout {

    public RegistrationView(UserService userService) {
        addClassName("registration-view");
        setSizeFull();
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);

        TextField username = new TextField("Username");
        TextField fullName = new TextField("Full Name");
        EmailField email = new EmailField("Email");
        DatePicker dob = new DatePicker("Date of Birth");
        PasswordField password = new PasswordField("Password");

        Button register = new Button("Register", e -> {
            try {
                userService.registerUser(username.getValue(), email.getValue(), password.getValue(),
                        fullName.getValue(), dob.getValue());
                Notification.show("Registration successful! Please login.");
                getUI().ifPresent(ui -> ui.navigate(LoginView.class));
            } catch (Exception ex) {
                Notification.show("Error: " + ex.getMessage());
            }
        });

        add(new H1("Create Account"), username, fullName, email, dob, password, register);
    }
}
