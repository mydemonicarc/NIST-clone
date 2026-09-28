/**
 * NIST UNIVERSITY - JAVASCRIPT CONTROLLER
 * Handles:
 * - Mobile Navigation Toggle
 * - Active Navigation Link Spy & Smooth Scrolling
 * - Faculty Directory Live Search & Department Filter
 * - Admission Form Validation, Live Photo Upload & Preview
 * - Form Reset & Submission Modal Summary
 * - Back to Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');

  if (menuToggleBtn && navLinks) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu on nav item click
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          menuToggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. SCROLL SPY & BACK TO TOP
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;

    // Show/hide Back to Top button
    if (backToTopBtn) {
      if (scrollPosition > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Active Section Scroll Spy
    const offsetPos = scrollPosition + 150;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (offsetPos >= top && offsetPos < top + height) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. FACULTY LIVE SEARCH & DEPARTMENT FILTER
  // --------------------------------------------------------------------------
  const facultySearch = document.getElementById('facultySearch');
  const facultyTable = document.getElementById('facultyTable');
  const filterBtns = document.querySelectorAll('#deptFilter .filter-btn');

  let currentDeptFilter = 'all';

  function filterFacultyTable() {
    if (!facultyTable) return;
    const searchTerm = facultySearch ? facultySearch.value.toLowerCase().trim() : '';
    const rows = facultyTable.querySelectorAll('tbody tr');

    rows.forEach(row => {
      const dept = row.getAttribute('data-dept');
      const text = row.textContent.toLowerCase();

      const matchesDept = (currentDeptFilter === 'all' || dept === currentDeptFilter);
      const matchesSearch = text.includes(searchTerm);

      if (matchesDept && matchesSearch) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (facultySearch) {
    facultySearch.addEventListener('input', filterFacultyTable);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDeptFilter = btn.getAttribute('data-filter');
      filterFacultyTable();
    });
  });

  // --------------------------------------------------------------------------
  // 4. PHOTO UPLOAD & LIVE PREVIEW
  // --------------------------------------------------------------------------
  const photoUpload = document.getElementById('photoUpload');
  const dropZone = document.getElementById('dropZone');
  const dropzoneContent = document.getElementById('dropzoneContent');
  const photoPreviewContainer = document.getElementById('photoPreviewContainer');
  const photoPreviewImg = document.getElementById('photoPreviewImg');
  const previewFileName = document.getElementById('previewFileName');
  const previewFileSize = document.getElementById('previewFileSize');
  const btnRemovePhoto = document.getElementById('btnRemovePhoto');
  const photoError = document.getElementById('photoError');

  function handleFileSelection(file) {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      if (photoError) photoError.textContent = 'Please select a valid image file (JPG, JPEG, or PNG).';
      resetPhotoUpload();
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      if (photoError) photoError.textContent = 'File size exceeds 2MB limit. Please choose a smaller photo.';
      resetPhotoUpload();
      return;
    }

    if (photoError) photoError.textContent = '';

    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreviewImg.src = e.target.result;
      previewFileName.textContent = file.name;
      previewFileSize.textContent = (file.size / 1024).toFixed(1) + ' KB';

      dropzoneContent.style.display = 'none';
      photoPreviewContainer.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  function resetPhotoUpload() {
    if (photoUpload) photoUpload.value = '';
    if (photoPreviewImg) photoPreviewImg.src = '';
    if (dropzoneContent) dropzoneContent.style.display = 'block';
    if (photoPreviewContainer) photoPreviewContainer.style.display = 'none';
  }

  if (photoUpload) {
    photoUpload.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  if (dropZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        photoUpload.files = e.dataTransfer.files;
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });
  }

  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener('click', (e) => {
      e.stopPropagation();
      resetPhotoUpload();
    });
  }

  // --------------------------------------------------------------------------
  // 5. ADMISSION FORM VALIDATION & SUBMISSION MODAL
  // --------------------------------------------------------------------------
  const admissionForm = document.getElementById('admissionForm');
  const submissionModal = document.getElementById('submissionModal');
  const modalSummaryContent = document.getElementById('modalSummaryContent');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnResetForm = document.getElementById('btnResetForm');

  // Input elements
  const studentNameInput = document.getElementById('studentName');
  const studentEmailInput = document.getElementById('studentEmail');
  const mobileNumberInput = document.getElementById('mobileNumber');
  const dobInput = document.getElementById('dob');
  const courseSelect = document.getElementById('courseSelect');
  const residentialAddress = document.getElementById('residentialAddress');

  // Error spans
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const mobileError = document.getElementById('mobileError');
  const dobError = document.getElementById('dobError');
  const genderError = document.getElementById('genderError');
  const courseError = document.getElementById('courseError');
  const addressError = document.getElementById('addressError');

  function clearErrorMessages() {
    [nameError, emailError, mobileError, dobError, genderError, courseError, addressError, photoError].forEach(el => {
      if (el) el.textContent = '';
    });
  }

  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      clearErrorMessages();
      resetPhotoUpload();
    });
  }

  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrorMessages();

      let isValid = true;

      // 1. Name Validation
      const nameVal = studentNameInput.value.trim();
      if (!nameVal) {
        nameError.textContent = 'Please enter student full name.';
        isValid = false;
      } else if (nameVal.length < 3) {
        nameError.textContent = 'Name must be at least 3 characters.';
        isValid = false;
      }

      // 2. Email Validation
      const emailVal = studentEmailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        emailError.textContent = 'Please enter an email address.';
        isValid = false;
      } else if (!emailPattern.test(emailVal)) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // 3. Mobile Validation
      const mobileVal = mobileNumberInput.value.trim();
      const mobilePattern = /^[0-9]{10}$/;
      if (!mobileVal) {
        mobileError.textContent = 'Please enter a 10-digit mobile number.';
        isValid = false;
      } else if (!mobilePattern.test(mobileVal)) {
        mobileError.textContent = 'Mobile number must be exactly 10 digits.';
        isValid = false;
      }

      // 4. Date of Birth Validation
      const dobVal = dobInput.value;
      if (!dobVal) {
        dobError.textContent = 'Please select date of birth.';
        isValid = false;
      }

      // 5. Gender Validation
      const genderSelected = document.querySelector('input[name="gender"]:checked');
      if (!genderSelected) {
        genderError.textContent = 'Please select your gender.';
        isValid = false;
      }

      // 6. Course Selection
      const courseVal = courseSelect.value;
      if (!courseVal) {
        courseError.textContent = 'Please select a program/course.';
        isValid = false;
      }

      // 7. Address
      const addressVal = residentialAddress.value.trim();
      if (!addressVal) {
        addressError.textContent = 'Please provide your residential address.';
        isValid = false;
      } else if (addressVal.length < 10) {
        addressError.textContent = 'Address should contain at least 10 characters.';
        isValid = false;
      }

      // 8. Photo Upload Validation
      if (!photoUpload.files || photoUpload.files.length === 0) {
        if (photoError) photoError.textContent = 'Please upload a passport-size photograph.';
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // Collect Hobbies
      const selectedHobbies = [];
      document.querySelectorAll('input[name="hobbies"]:checked').forEach(cb => {
        selectedHobbies.push(cb.value);
      });
      const hobbiesString = selectedHobbies.length > 0 ? selectedHobbies.join(', ') : 'None specified';

      // Generate Modal Summary
      modalSummaryContent.innerHTML = `
        <div class="modal-summary-row">
          <strong>Applicant Name:</strong>
          <span>${nameVal}</span>
        </div>
        <div class="modal-summary-row">
          <strong>Email Address:</strong>
          <span>${emailVal}</span>
        </div>
        <div class="modal-summary-row">
          <strong>Mobile Number:</strong>
          <span>+91 ${mobileVal}</span>
        </div>
        <div class="modal-summary-row">
          <strong>Date of Birth:</strong>
          <span>${dobVal}</span>
        </div>
        <div class="modal-summary-row">
          <strong>Gender:</strong>
          <span>${genderSelected ? genderSelected.value : 'N/A'}</span>
        </div>
        <div class="modal-summary-row">
          <strong>Selected Course:</strong>
          <span>${courseVal}</span>
        </div>
        <div class="modal-summary-row">
          <strong>Hobbies / Interests:</strong>
          <span>${hobbiesString}</span>
        </div>
        <div class="modal-summary-row">
          <strong>Address:</strong>
          <span>${addressVal}</span>
        </div>
        <div class="modal-summary-row">
          <strong>Photo File:</strong>
          <span>${photoUpload.files[0] ? photoUpload.files[0].name : 'Uploaded'}</span>
        </div>
      `;

      // Show Modal
      submissionModal.classList.add('active');
    });
  }

  if (btnCloseModal && submissionModal) {
    btnCloseModal.addEventListener('click', () => {
      submissionModal.classList.remove('active');
      if (admissionForm) admissionForm.reset();
      resetPhotoUpload();
      clearErrorMessages();
    });

    // Close on overlay click outside dialog
    submissionModal.addEventListener('click', (e) => {
      if (e.target === submissionModal) {
        submissionModal.classList.remove('active');
      }
    });
  }
});
