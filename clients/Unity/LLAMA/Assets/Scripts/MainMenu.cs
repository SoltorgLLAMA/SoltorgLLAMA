using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
public class MainMenu : MonoBehaviour
{
    private void Start()
    {
        GameObject.Find("Settings Menu").SetActive(false); // Back knappen ska inte vara aktiv från början.
    }

    public void PlayGame()
    {
        int sceneIndex = SceneManager.GetActiveScene().buildIndex;
        SceneManager.LoadScene(sceneBuildIndex: +1);
    }

    public void Quit()
    {
        Application.Quit();
    }


}
