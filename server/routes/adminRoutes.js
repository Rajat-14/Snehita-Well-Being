const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin');

// ──────────────────────────────────────────────
// Auth (no middleware needed here)
// ──────────────────────────────────────────────
router.post('/admin/login', adminController.adminLogin);
router.get('/admin/logout', adminController.adminLogout);
router.get('/admin/verify', isAdmin, adminController.verifyAdmin);

// ──────────────────────────────────────────────
// Organization Info (About Us)
// ──────────────────────────────────────────────
router.get('/admin/organization-info', isAdmin, adminController.getOrganizationInfo);
router.post('/admin/organization-info', isAdmin, adminController.createOrganizationInfo);
router.put('/admin/organization-info/:id', isAdmin, adminController.updateOrganizationInfo);
router.delete('/admin/organization-info/:id', isAdmin, adminController.deleteOrganizationInfo);

// ──────────────────────────────────────────────
// Contact Details
// ──────────────────────────────────────────────
router.get('/admin/contact-details', isAdmin, adminController.getContactDetails);
router.post('/admin/contact-detail', isAdmin, adminController.createContactDetail);
router.put('/admin/contact-detail/:id', isAdmin, adminController.updateContactDetail);

// ──────────────────────────────────────────────
// Counselors
// ──────────────────────────────────────────────
router.get('/admin/counselors', isAdmin, adminController.getCounselors);
router.post('/admin/counselor', isAdmin, adminController.addCounselor);
router.delete('/admin/counselor/:id', isAdmin, adminController.deleteCounselor);

module.exports = router;
