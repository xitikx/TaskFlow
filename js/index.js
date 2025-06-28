document.addEventListener("DOMContentLoaded", () => {
  // Auto-redirect if user data exists
  const existingUser = localStorage.getItem("userData");
  if (existingUser) {
    window.location.href = "app.html";
    return;
  }

  const form = document.getElementById("registration-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const dobInput = document.getElementById("dob");

    const name = nameInput.value.trim();
    const dob = dobInput.value;

    //Basic validation
    if (!name || !dob) {
      alert("Please fill in both name and date of birth.");
      return;
    }

    //Age validation
    const age = calculateAge(new Date(dob));
    if (age <= 10) {
      alert("Sorry, you must be older than 10 to use TaskFlow.");
      return;
    }

    //Save userData to localStorage
    const userData = {
      name,
      dob,
      age,
    };
    localStorage.setItem("userData", JSON.stringify(userData));

    //Redirect to main app
    window.location.href = "app.html";
  });
});

//Age Calculation Helper
function calculateAge(dob) {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}
