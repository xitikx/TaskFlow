document.addEventListener("DOMContentLoaded", () => {
  const existingUser = localStorage.getItem("userData");
  if (existingUser) {
    // 👇 Let animation play for 500ms before redirecting
    setTimeout(() => {
      window.location.href = "app.html";
    }, 500);
    return;
  }

  const form = document.getElementById("registration-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const dobInput = document.getElementById("dob");

    const name = nameInput.value.trim();
    const dob = dobInput.value;

    if (!name || !dob) {
      alert("Please fill in both name and date of birth.");
      return;
    }

    const age = calculateAge(new Date(dob));
    if (age <= 10) {
      alert("Sorry, you must be older than 10 to use TaskFlow.");
      return;
    }

    const userData = {
      name,
      dob,
      age,
    };
    localStorage.setItem("userData", JSON.stringify(userData));

    // 👇 Give time for any final animation (optional)
    setTimeout(() => {
      window.location.href = "app.html";
    }, 300);
  });
});

function calculateAge(dob) {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}
