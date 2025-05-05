def friedmann_equation(a, t, H0, Omega_m, Omega_lambda):
    return H0 * np.sqrt(Omega_m/a**3 + Omega_lambda)
def simulate_cosmology(t, H0, Omega_m, Omega_lambda):
    a0 = 1e-5  # initial scale factor
    solution = odeint(friedmann_equation, a0, t, args=(H0, Omega_m, Omega_lambda))
    return solution
