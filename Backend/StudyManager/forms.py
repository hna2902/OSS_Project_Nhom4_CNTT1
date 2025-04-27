# forms.py
from django import forms

class RegisterForm(forms.Form):
    ten = forms.CharField(max_length=100, required=True)
    tai_khoan = forms.CharField(max_length=100, required=True)
    mat_khau = forms.CharField(widget=forms.PasswordInput, required=True)
