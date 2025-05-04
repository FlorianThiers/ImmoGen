

def estimate_distance_to_center(location):
    """Estimate the distance to the center of Ghent."""
    # Simple heuristic - in practice, you would use geocoding
    if isinstance(location, str):
        if "Ghent" not in location:
            return 5.0  # Outside Ghent
        elif "center" in location.lower():
            return 0.5  # Center
        else:
            return 2.5  # Somewhere in Ghent
    return 3.0  # Default value

def estimate_neighborhood_safety(location):
    """Estimate the neighborhood safety (score out of 10)."""
    # Simple heuristic - in practice, you would use real data
    if isinstance(location, str):
        location_lower = location.lower()
        # Examples (this would be replaced with real data)
        if "center" in location_lower:
            return 7
        elif "gentbrugge" in location_lower:
            return 8
        elif "sint-amandsberg" in location_lower:
            return 7
        elif "zwijnaarde" in location_lower:
            return 9
        elif "ledeberg" in location_lower:
            return 6
    return 7  # Default value
