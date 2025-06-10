from pydantic import BaseModel

class AdminStats(BaseModel):
    totalUsers: int
    totalScrapedPages: int
    lastTrainingDate: str
    systemHealth: str
    storageUsed: str
