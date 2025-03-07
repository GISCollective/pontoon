# Generated by Django 4.2.17 on 2025-01-15 08:19

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("base", "0070_userprofile_transactional_emails"),
    ]

    operations = [
        migrations.AlterField(
            model_name="repository",
            name="type",
            field=models.CharField(
                choices=[("git", "Git"), ("hg", "HG")], default="git", max_length=255
            ),
        ),
    ]
