from prisma import Prisma
from prisma.enums import Role  # noqa: F401
from prisma.models import Message  # noqa: F401
from prisma.types import MessageCreateInput as MessageCreate  # noqa: F401

db = Prisma()
