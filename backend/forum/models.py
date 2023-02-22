from django.db import models
import datetime


# lets us explicitly set upload path and filename
def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)


class Post(models.Model):
    # add user image after login

    # auth... User
    # change to foriengnkey to User after
    Post_author = models.CharField(max_length=30, default="anonymous")
    Post_title = models.CharField(max_length=30)
    Post_content = models.CharField(max_length=1000)
    # change
    image = models.ImageField(upload_to=upload_to, max_length=1000, null=True)
    Post_created_date = models.DateTimeField(
        auto_now=True)

    def __str__(self):
        return self.Post_title

# null = true allow null if empty, blank = true can be set as empty
# model.CASCADE if delete the primarykey, it would delete the foreignkey,too.


class Reply(models.Model):
    # change to foriengnkey to user after
    reply_post = models.ForeignKey(
        Post, related_name="threads", on_delete=models.CASCADE, default="")
    reply_user = models.CharField(max_length=10, default="anonymous")
    # add user image after login
    reply_content = models.CharField(max_length=500, default="")
