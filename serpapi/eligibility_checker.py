def check_eligibility(student, scholarship):
    """
    Check whether a student satisfies the
    scholarship requirements that are available
    in the extracted scholarship data.

    Status:
        Eligible
        Not Eligible
        Insufficient Information
    """

    reasons = []
    failed_reasons = []
    missing_requirements = []

    # --------------------------------------------------
    # State / Domicile
    # --------------------------------------------------

    if scholarship.get("state"):

        if (
            student.get("state")
            and student["state"].lower()
            == scholarship["state"].lower()
        ):
            reasons.append(
                "Student is from the required state."
            )
        else:
            failed_reasons.append(
                "Student is not from the required state."
            )

    else:
        missing_requirements.append(
            "State requirement could not be determined."
        )

    # --------------------------------------------------
    # Income
    # --------------------------------------------------

    if scholarship.get("income_limit") is not None:

        if student.get("income") is None:

            missing_requirements.append(
                "Student family income is not available."
            )

        elif student["income"] <= scholarship["income_limit"]:

            reasons.append(
                "Family income is within the scholarship limit."
            )

        else:

            failed_reasons.append(
                "Family income exceeds the scholarship limit."
            )

    else:

        missing_requirements.append(
            "Income limit was not found in the source."
        )

    # --------------------------------------------------
    # Marks
    # --------------------------------------------------

    if scholarship.get("minimum_marks") is not None:

        if student.get("marks") is None:

            missing_requirements.append(
                "Student marks are not available."
            )

        elif student["marks"] >= scholarship["minimum_marks"]:

            reasons.append(
                "Student meets the minimum marks requirement."
            )

        else:

            failed_reasons.append(
                "Student does not meet the minimum marks requirement."
            )

    else:

        missing_requirements.append(
            "Minimum marks requirement was not found in the source."
        )

    # --------------------------------------------------
    # Category
    # --------------------------------------------------

    categories = scholarship.get("categories", [])

    if categories:

        student_category = student.get("category")

        if (
            student_category
            and student_category.lower()
            in [category.lower() for category in categories]
        ):

            reasons.append(
                "Student belongs to an eligible category."
            )

        else:

            failed_reasons.append(
                "Student category is not listed as eligible."
            )

    else:

        missing_requirements.append(
            "Eligible categories were not found in the source."
        )

    # --------------------------------------------------
    # Course
    # --------------------------------------------------

    courses = scholarship.get("courses", [])

    if courses:

        student_course = student.get("course", "").lower()

        course_match = False

        for course in courses:

            if course.lower() in student_course:
                course_match = True
                break

        if course_match:

            reasons.append(
                "Student's course matches the scholarship."
            )

        else:

            failed_reasons.append(
                "Student's course is not listed as eligible."
            )

    else:

        missing_requirements.append(
            "Eligible courses were not found in the source."
        )

    # --------------------------------------------------
    # Final Status
    # --------------------------------------------------

    if failed_reasons:

        status = "Not Eligible"

    elif missing_requirements:

        status = "Insufficient Information"

    else:

        status = "Eligible"

    # --------------------------------------------------
    # Return result
    # --------------------------------------------------

    return {
        "status": status,
        "reasons": reasons,
        "failed_reasons": failed_reasons,
        "missing_requirements": missing_requirements
    }