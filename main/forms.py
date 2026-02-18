from django import forms


class OrderForm(forms.Form):
    customer_name = forms.CharField(label="Имя", max_length=255, required=True)
    customer_email = forms.EmailField(label="Электронная почта", required=True)


