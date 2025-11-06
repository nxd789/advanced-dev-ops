from behave import *

import calc

from behave.api.pending_step import StepNotImplementedError
@given(u'we have included the calc module')
def step_impl(context):
    contents = dir(calc)


@when(u'we call the add function with {a} and {b}')
def step_impl(context,a,b):
    a = float(a)
    b = float(b)
    context.result = calc.add(a,b)


@then(u'we will get {number}')
def step_impl(context, number):
    number = float(number)
    assert context.result == number


@when(u'we call the mul function with {a} and {b}')
def step_impl(context,a,b):
    a = float(a)
    b = float(b)
    context.result = calc.mul(a,b)

